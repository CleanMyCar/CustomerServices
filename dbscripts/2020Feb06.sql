/****** Object:  StoredProcedure [dbo].[DeleteUserCartItem]    Script Date: 2/6/2020 12:18:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[DeleteUserCartItem](@UserId INT, @Id INT)
AS
BEGIN

DELETE VehicleRequestedServices
FROM VehicleRequestedServices vservices
JOIN UserCart
ON UserCart.ProductId = vservices.RequestId
WHERE Id = @Id AND vservices.UserId = @UserId;

DELETE FROM UserCart WHERE Id = @Id AND UserId = @UserId;
END







/****** Object:  StoredProcedure [dbo].[SaveVehicleRequest]    Script Date: 2/5/2020 11:08:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SaveVehicleRequest]
@RequestId INT,
@VehicleId INT,
@ServiceType INT,
@ServiceId INT,
@Frequency INT,
@Promocode NVarchar(50),
@UserId INT,
@Timeslot Nvarchar(10),
@WeeklyDay INT,
@ServiceDate Date,
@Quantity INT,
@ServiceStausId INT,
@OtherAddressId INT
AS 
Declare @ErrorMessage Nvarchar(500), @ErrorCode INT, @ServicePrice money, @UserWalletAmount money, @now varchar(5) = (CONVERT(varchar(5), CAST(GETDATE() AS TIME(1)))), @SystemTimeSlotId INT;
-- ServiceType 1 - Subscription, 2 - purchase once

BEGIN

	SET @ServicePrice = (SELECT Amount FROM GetVehiclePriceByServiceId(@ServiceId, @VehicleId, @ServiceType, @Frequency))
	SET @UserWalletAmount = (SELECT Amount FROM Wallet WHERE UserId = @UserId);

	SET @SystemTimeSlotId = (SELECT TimeSlotId FROM TimeSlots WHERE StartTime > @now AND EndTime < @now );	
	--SELECT CONVERT(date, getdate()), @ServiceDate, @SystemTimeSlotId , @Timeslot, @now
	--return;

	IF((@ServicePrice * @Quantity) > @UserWalletAmount)
		BEGIN
		SET @ErrorMessage = 'Insufficient balance in Wallet, please recharge your wallet and subscribe services'
		SET @ErrorCode = -99;
		END
	ELSE IF @now < '22:00' AND @now > '06:00' AND (@SystemTimeSlotId IS NULL OR @Timeslot IS NULL OR ( (SELECT CONVERT(date, getdate())) = @ServiceDate AND @SystemTimeSlotId < @Timeslot))
	BEGIN
		SET @ErrorMessage = 'Please select future time slot'
	END
	ELSE 
	BEGIN

		IF @RequestId = -1 OR @RequestId IS NULL
		IF EXISTS(SELECT RequestId FROM VehicleRequestedServices vechicleServices
					JOIN Services 
					ON Services.ServiceId = vechicleServices.ServiceId
					WHERE Frequency IS NOT NULL 
					AND Services.ServiceId = @ServiceId AND vechicleServices.ParentId IS NULL 
					AND ServiceType = @ServiceType
					AND vechicleServices.ServiceStatusId NOT IN (3, 5, 6) AND UserId = @UserId 
					AND (
							(Services.VehicleCategoryType = 3) 
							OR (Services.VehicleCategoryType != 3 AND vechicleServices.VehicleId = @VehicleId)
						)
			)
			BEGIN
				SET @ErrorMessage = 'Subscription already taken for this Vehicle/Product, please modify the existing subscription'
			
			END
		ELSE IF EXISTS(SELECT RequestId FROM VehicleRequestedServices vechicleServices
					JOIN Services 
					ON Services.ServiceId = vechicleServices.ServiceId
					WHERE Services.ServiceId = @ServiceId AND vechicleServices.ParentId IS NULL 
					AND ServiceType = @ServiceType
					AND vechicleServices.ServiceStatusId NOT IN (3, 5, 6) AND UserId = @UserId 
					AND (
							(Services.VehicleCategoryType = 3) 
							OR (Services.VehicleCategoryType != 3 AND vechicleServices.VehicleId = @VehicleId)
						)
						AND ServiceDate = @ServiceDate
			)
			BEGIN
				SET @ErrorMessage = 'This Service is already taken for this Vehicle/Product, please select another date'
			
			END
		ELSE
		BEGIN
			INSERT INTO VehicleRequestedServices
			(VehicleId, ServiceType, ServiceId, Frequency, Promocode, ServiceStatusId, UserId, TimeSlot, ServiceDate, WeeklyDay, Quantity, OtherAddressId)
			VALUES(@VehicleId, @ServiceType, @ServiceId, @Frequency, @Promocode, @ServiceStausId, @UserId, @Timeslot,  @ServiceDate, @WeeklyDay, @Quantity, @OtherAddressId);


			SELECT @RequestId = SCOPE_IDENTITY()
		END
	END
	SELECT @ErrorMessage AS ErrorMessage, @ErrorCode AS ErrorCode, @RequestId as RequestId, Email, MobileNumber FROM user_ref WHERE UserId = @UserId;
	SELECT ServiceId, ServiceName FROM Services Where ServiceId = @ServiceId;

END



/****** Object:  StoredProcedure [dbo].[UpdateServiceStatus]    Script Date: 2/6/2020 12:37:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[UpdateServiceStatus]
@RequestId INT,
@Reason NVarchar(500),
@StatusId INT,
@UserId INT,
@ServiceProofImage TEXT
AS 

DROP TABLE IF EXISTS #CustomerDetails;
CREATE TABLE #CustomerDetails
(
	UserId INT,
	MobileNumber varchar(20),
	Email varchar(100),
	FirstName Varchar(50)
)

Declare @ServicePrice money, @WalletAmount money, @ErrorMessage Varchar(100);
SET @ServicePrice = (SELECT Amount from GetVehiclePriceByRequestId(@RequestId));
SET @WalletAmount = (SELECT Amount from Wallet JOIN VehicleRequestedServices vr ON vr.UserId = Wallet.UserId WHERE RequestId = @RequestId);

IF @StatusId=5  AND @WalletAmount < @ServicePrice
BEGIN
	INSERT INTO #CustomerDetails 
	SELECT vr.UserId, MobileNumber, Email, UserFirstName FROM VehicleRequestedServices vr JOIN user_ref ON user_ref.UserId = vr.UserId
	WHERE RequestId = @RequestId;
	SET @ErrorMessage = 'Customer does not have sufficient Amount, please inform customer care';
END

ELSE

BEGIN
	UPDATE VehicleRequestedServices 
	SET ServiceStatusId = @StatusId, ServiceNotes = @Reason, ServiceProofImage = @ServiceProofImage, ServiceCompletedDate = GETDATE()
	WHERE RequestId = @RequestId;

	IF @StatusId=5
	BEGIN

	INSERT INTO VehicleServiceTransactions (RequestId, ServicePersonId, ServiceStatusId, Amount)
	VALUES (@RequestId, @UserId, @StatusId, @ServicePrice);

	UPDATE Wallet SET Wallet.Amount = Wallet.Amount - @ServicePrice
	WHERE UserId = (SELECT UserId FROM VehicleRequestedServices WHERE RequestId = @RequestId)

	INSERT INTO WalletTransactions(WalletId, Amount, TransactionTypeId, IsCredited, RequestId)
	VALUES((SELECT WalletId FROM Wallet WHERE UserId = @UserId ), @ServicePrice, 1, 0, @RequestId)

	UPDATE Wallet SET Amount = superadminUserWallet.Amount + @ServicePrice
	FROM Wallet superadminUserWallet
	JOIN user_ref ON user_ref.UserId = superadminUserWallet.UserId  
	JOIN Wallet wallet
	on wallet.UserId = superadminUserWallet.UserId
	WHERE user_ref.UserRoleId = 0;

	INSERT INTO WalletTransactions(WalletId, Amount, TransactionTypeId, RequestId)
	VALUES((SELECT WalletId FROM Wallet JOIN user_ref ON user_ref.UserId = Wallet.UserId  WHERE user_ref.UserRoleId = 0 ), @ServicePrice, 1, @RequestId)

	END
END

SELECT @ErrorMessage AS ErrorMessage, @RequestId As RequestId;
SELECT * FROM #CustomerDetails;



/****** Object:  StoredProcedure [dbo].[GetMyProducts]    Script Date: 2/6/2020 7:48:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetMyProducts]
@UserId INT,
@IsPersonal INT
AS 
SELECT * FROM VehicleDetails WHERE UserId = @UserId AND StatusId=1 AND IsPersonal = @IsPersonal;




/****** Object:  StoredProcedure [dbo].[SaveVehicleDetails]    Script Date: 2/6/2020 8:17:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SaveVehicleDetails]
@VehicleId INT,
@VehicleNumber NVarchar(100),
@VehicleMake NVarchar(100),
@VehicleModel NVarchar(100),
@ParkingLot NVarchar(100),
@AddressId INT,
@IsPersonal INT,
@VehicleTypeId INT,
@FourWheelerTypeId INT,
@StatusId INT,
@UserId INT,
@VehicleName NVarchar(100),
@VehicleImage TEXT

AS 

IF @VehicleId IS NULL OR @VehicleId = -1
	IF EXISTS(SELECT VehicleNumber FROM VehicleDetails WHERE VehicleNumber = @VehicleNumber AND UserId = @UserId)
		SET @VehicleId = (SELECT VehicleId FROM VehicleDetails WHERE VehicleNumber = @VehicleNumber AND UserId = @UserId)


IF @VehicleId IS NULL OR @VehicleId = -1
	BEGIN
		INSERT INTO VehicleDetails
		(VehicleNumber, VehicleMake, VehicleModel, ParkingLot, AddressId, IsPersonal, VehicleTypeId, FourWheelerTypeId, StatusId, UserId, VehicleName, VehicleImage)
		VALUES(@VehicleNumber, @VehicleMake, @VehicleModel, @ParkingLot, @AddressId, @IsPersonal, @VehicleTypeId, @FourWheelerTypeId, @StatusId, @UserId, @VehicleName, @VehicleImage);
		SELECT @VehicleId = SCOPE_IDENTITY()
	END
ELSE
	BEGIN
		-- Delete the vehicle subscriptions when vehicle type is changed
		IF(@VehicleTypeId != (SELECT VehicleTypeId FROM VehicleDetails WHERE VehicleId = @VehicleId AND UserId = @UserId))
		BEGIN
			UPDATE VehicleRequestedServices SET ServiceStatusId = 3 WHERE VehicleId = @VehicleId;
		END


		UPDATE VehicleDetails
			SET VehicleNumber=@VehicleNumber, VehicleMake=@VehicleMake, VehicleModel=@VehicleModel, 
			ParkingLot= @ParkingLot, AddressId=@AddressId, IsPersonal=@IsPersonal, 
			VehicleTypeId=@VehicleTypeId, FourWheelerTypeId=@FourWheelerTypeId, StatusId= @StatusId,
			VehicleName = @VehicleName, VehicleImage = @VehicleImage
		WHERE VehicleId = @VehicleId;

	END

SELECT @VehicleId AS VehicleId;






/****** Object:  StoredProcedure [dbo].[SaveVehicleRequest]    Script Date: 2/5/2020 11:08:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SaveVehicleRequest]
@RequestId INT,
@VehicleId INT,
@ServiceType INT,
@ServiceId INT,
@Frequency INT,
@Promocode NVarchar(50),
@UserId INT,
@Timeslot Nvarchar(10),
@WeeklyDay INT,
@ServiceDate Date,
@Quantity INT,
@ServiceStausId INT,
@OtherAddressId INT
AS 
Declare @ErrorMessage Nvarchar(500), @ErrorCode INT, @ServicePrice money, @UserWalletAmount money, @now varchar(5) = (CONVERT(varchar(5), CAST(GETDATE() AS TIME(1)))), @SystemTimeSlotId INT;
-- ServiceType 1 - Subscription, 2 - purchase once

BEGIN

	SET @ServicePrice = (SELECT Amount FROM GetVehiclePriceByServiceId(@ServiceId, @VehicleId, @ServiceType, @Frequency))
	SET @UserWalletAmount = (SELECT Amount FROM Wallet WHERE UserId = @UserId);

	SET @SystemTimeSlotId = (SELECT TimeSlotId FROM TimeSlots WHERE @now Between StartTime AND EndTime);	
	--SELECT CONVERT(date, getdate()), @ServiceDate, @SystemTimeSlotId , @Timeslot, @now
	--return;

	IF((@ServicePrice * @Quantity) > @UserWalletAmount)
		BEGIN
		SET @ErrorMessage = 'Insufficient balance in Wallet, please recharge your wallet and subscribe services'
		SET @ErrorCode = -99;
		END
	ELSE IF @now < '22:00' AND @now > '06:00' AND (@SystemTimeSlotId IS NULL OR @Timeslot IS NULL OR ( (SELECT CONVERT(date, getdate())) = @ServiceDate AND @Timeslot < @SystemTimeSlotId ))
	BEGIN
		SET @ErrorMessage = 'Please select future time slot'
	END
	ELSE 
	BEGIN

		IF @RequestId = -1 OR @RequestId IS NULL
		IF EXISTS(SELECT RequestId FROM VehicleRequestedServices vechicleServices
					JOIN Services 
					ON Services.ServiceId = vechicleServices.ServiceId
					WHERE Frequency IS NOT NULL 
					AND Services.ServiceId = @ServiceId AND vechicleServices.ParentId IS NULL 
					AND ServiceType = @ServiceType
					AND vechicleServices.ServiceStatusId NOT IN (3, 5, 6) AND UserId = @UserId 
					AND (
							(Services.VehicleCategoryType = 3) 
							OR (Services.VehicleCategoryType != 3 AND vechicleServices.VehicleId = @VehicleId)
						)
			)
			BEGIN
				SET @ErrorMessage = 'Subscription already taken for this Vehicle/Product, please modify the existing subscription'
			
			END
		ELSE IF EXISTS(SELECT RequestId FROM VehicleRequestedServices vechicleServices
					JOIN Services 
					ON Services.ServiceId = vechicleServices.ServiceId
					WHERE Services.ServiceId = @ServiceId AND vechicleServices.ParentId IS NULL 
					AND ServiceType = @ServiceType
					AND vechicleServices.ServiceStatusId NOT IN (3, 5, 6) AND UserId = @UserId 
					AND (
							(Services.VehicleCategoryType = 3) 
							OR (Services.VehicleCategoryType != 3 AND vechicleServices.VehicleId = @VehicleId)
						)
						AND ServiceDate = @ServiceDate
			)
			BEGIN
				SET @ErrorMessage = 'This Service is already taken for this Vehicle/Product, please select another date'
			
			END
		ELSE
		BEGIN
			INSERT INTO VehicleRequestedServices
			(VehicleId, ServiceType, ServiceId, Frequency, Promocode, ServiceStatusId, UserId, TimeSlot, ServiceDate, WeeklyDay, Quantity, OtherAddressId)
			VALUES(@VehicleId, @ServiceType, @ServiceId, @Frequency, @Promocode, @ServiceStausId, @UserId, @Timeslot,  @ServiceDate, @WeeklyDay, @Quantity, @OtherAddressId);


			SELECT @RequestId = SCOPE_IDENTITY()
		END
	END
	SELECT @ErrorMessage AS ErrorMessage, @ErrorCode AS ErrorCode, @RequestId as RequestId, Email, MobileNumber FROM user_ref WHERE UserId = @UserId;
	SELECT ServiceId, ServiceName FROM Services Where ServiceId = @ServiceId;

END





alter table VehicleTypes Add SortOrder INT;

update VehicleTypes set SortOrder = 2 Where VehicleTypeId = 1
update VehicleTypes set SortOrder = 1 Where VehicleTypeId = 2
update VehicleTypes set SortOrder = 3 Where VehicleTypeId = 3




/****** Object:  StoredProcedure [dbo].[UpdateSubscription]    Script Date: 2/22/2020 5:31:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[UpdateSubscription](
@RequestId INT,
@Frequency INT,
@TimeSlot INT,
@WeeklyDay INT,
@UserId INT
)
AS
BEGIN

Declare @prevFrequency INT, @prevTimeslot INT, @prevWeeklyday INT, @IsChanged INT = 0;

SELECT @prevFrequency=Frequency, @prevTimeslot=TimeSlot, @prevWeeklyday=WeeklyDay FROM VehicleRequestedServices WHERE RequestId = @RequestId;

IF(@prevFrequency != @Frequency OR @prevWeeklyday != @WeeklyDay)
BEGIN
	SET @IsChanged = 1;
	UPDATE VehicleRequestedServices SET ServiceStatusId = 3 
	WHERE ParentId = @RequestId AND ServiceDate > FORMAT (getdate(), 'yyyy-MM-dd') AND ServiceStatusId IN (1, 2, 4);

	--UPDATE VehicleRequestedServices SET ServicePersonId = NULL 
	--WHERE RequestId = @RequestId;
END

UPDATE VehicleRequestedServices SET Frequency = @Frequency, TimeSlot = @TimeSlot, WeeklyDay = @WeeklyDay
WHERE RequestId = @RequestId;

SELECT @RequestId AS RequestId, @IsChanged AS IsChanged, Email, MobileNumber FROM user_ref WHERE UserId = @UserId;
SELECT ServiceName, vServices.ServiceId FROM VehicleRequestedServices vServices
JOIN Services 
ON Services.ServiceId = vServices.ServiceId
WHERE RequestId = @RequestId;

SELECT devices.* FROM user_ref
JOIN UserDevices devices
ON devices.UserId = user_ref.UserId
WHERE user_ref.UserId = @UserId AND UserDeviceToken IS NOT NULL;

END




/****** Object:  StoredProcedure [dbo].[UpdateServiceStatus]    Script Date: 2/22/2020 5:46:54 PM ******/
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


INSERT INTO #CustomerDetails 
SELECT vr.UserId, MobileNumber, Email, UserFirstName FROM VehicleRequestedServices vr JOIN user_ref ON user_ref.UserId = vr.UserId
WHERE RequestId = @RequestId;

IF @StatusId=5  AND @WalletAmount < @ServicePrice
BEGIN	
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

SELECT devices.* FROM #CustomerDetails customer
JOIN UserDevices devices
ON devices.UserId = customer.UserId
WHERE customer.UserId = @UserId AND UserDeviceToken IS NOT NULL;



/****** Object:  StoredProcedure [dbo].[SaveVehicleRequest]    Script Date: 2/22/2020 6:04:08 PM ******/
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
	SELECT devices.* FROM user_ref customer
	JOIN UserDevices devices
	ON devices.UserId = customer.UserId
	WHERE customer.UserId = @UserId AND UserDeviceToken IS NOT NULL;

END



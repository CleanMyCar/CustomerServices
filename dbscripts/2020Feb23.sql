/****** Object:  StoredProcedure [dbo].[AssignPersonToService]    Script Date: 2/23/2020 1:50:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[AssignPersonToService]
@RequestId INT,
@UserId INT
AS 
UPDATE VehicleRequestedServices SET ServicePersonId = @UserId, ServiceAssignedDate = getdate(), ServiceStatusId = 4 
WHERE (RequestId = @RequestId OR ParentId = @RequestId) AND ServiceDate >= FORMAT (getdate(), 'yyyy-MM-dd 00:00:00') 
AND ServiceStatusId = 1;

SELECT @RequestId AS RequestId;

SELECT device.UserDeviceToken, device.UserDeviceType, userref.MobileNumber FROM VehicleRequestedServices services
JOIN UserDevices device
ON device.UserId = services.UserId
JOIN user_ref userref
ON userref.UserId = services.UserId
WHERE services.RequestId = @RequestId;



/****** Object:  StoredProcedure [dbo].[UpdateServiceStatus]    Script Date: 2/23/2020 2:07:41 PM ******/
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

SELECT @ErrorMessage AS ErrorMessage, @RequestId As RequestId, vehicle.VehicleNumber
FROM VehicleRequestedServices vservices
JOIN VehicleDetails vehicle
ON vservices.VehicleId = vehicle.VehicleId
WHERE RequestId = @RequestId;

SELECT * FROM #CustomerDetails;

SELECT devices.* FROM #CustomerDetails customer
JOIN UserDevices devices
ON devices.UserId = customer.UserId
WHERE customer.UserId = @UserId AND UserDeviceToken IS NOT NULL;




/****** Object:  StoredProcedure [dbo].[GetAssignedVehicleServices]    Script Date: 2/23/2020 3:26:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetAssignedVehicleServices]
(
@ServiceStatusId INT,
@ServiceDate Date,
@ServiceId INT,
@AddressId INT,
@PersonId INT,
@MobileNumber Nvarchar(20)
)
AS 

DECLARE @sqlStmt nvarchar(4000), @whereCondition nvarchar(1000) = '', @othercondition nvarchar(1000) = '';

SET @sqlStmt = 'SELECT (CASE WHEN child.ParentId IS NOT NULL THEN child.RequestId  WHEN child.ParentId IS NULL THEN request.RequestId END ) AS RequestId, 
request.VehicleId, request.ServiceType, Services.ServiceName, 
Services.ServiceId,Services.Price, Services.SubscriptionPrice, request.Frequency, request.ServiceStatusId, request.Promocode, vd.VehicleNumber, 
SubscriptionType.SubscribeType, vd.VehicleName, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) AS ServiceDate, request.TimeSlot, request.RequestedOn, 
(CASE WHEN child.ParentId IS NOT NULL THEN child.ServicePersonId  WHEN child.ParentId IS NULL THEN request.ServicePersonId END ) AS ServicePersonId,
vd.ParkingLot, Address.AddressLine1,  vd.VehicleTypeId, vpirce.SubscriptionPrice AS FourWheelerSubPrice, vpirce.Price AS FourWheelerOncePrice,
user_ref.UserFirstName, user_ref.UserLastName, user_ref.MobileNumber, request.Quantity, request.ParentId, child.ServiceStatusId AS ChildServiceStatusId,
child.ParentId AS ChildParentId, (select Amount from GetVehiclePriceByRequestId(request.RequestId)) AS RequestPrice,
otherAddress.AddressLine1 AS OtherAddressLine1, otherAddress.AddressLine2 AS OtherAddressLine2, otherAddress.AddressId AS OtherAddressId,
customer.UserFirstName AS CustomerFirstName, customer.UserLastName AS CustomerLastName, customer.MobileNumber AS CustomerMobileNumber
FROM VehicleRequestedServices request
JOIN Services
ON Services.ServiceId = request.ServiceId
LEFT JOIN VehicleDetails vd
ON vd.VehicleId = request.VehicleId
LEFT JOIN SubscriptionType
ON SubscriptionType.SubscribeId = request.Frequency
LEFT JOIN Address
ON Address.AddressId = vd.AddressId
LEFT JOIN VehicleServicePrice vpirce
ON vpirce.ServiceId = request.ServiceId AND vpirce.VehicleCategoryType = vd.FourWheelerTypeId
LEFT JOIN user_ref
ON user_ref.UserId = request.ServicePersonId
JOIN user_ref customer
ON customer.UserId = request.UserId
LEFT JOIN Address otherAddress
ON otherAddress.AddressId = request.OtherAddressId 
LEFT JOIN VehicleRequestedServices child 
ON child.ParentId = request.RequestId';

SET @whereCondition = ' WHERE (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceStatusId WHEN child.ParentId IS NULL THEN request.ServiceStatusId END ) = ''' +  CAST(@ServiceStatusId AS nvarchar)  + ''' ';

IF @ServiceStatusId = 1 
	BEGIN
		
		SET @whereCondition += ' AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate WHEN request.ServiceType = 2 THEN  request.ServiceDate END) = ''' + CAST(@ServiceDate AS nvarchar)  + ''' '; 
		SET @othercondition += ' AND request.ParentId IS NULL '
	END
ELSE
	SET @othercondition += ' AND request.ParentId IS NULL AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) = ''' + CAST(@ServiceDate AS nvarchar)  + ''' '

IF @ServiceId IS NOT NULL AND @ServiceId != -1
SET @othercondition += ' AND request.ServiceId=''' + CAST(@ServiceId AS nvarchar) + '''';


IF @AddressId IS NOT NULL AND @AddressId != -1
SET @othercondition += ' AND vd.AddressId=''' + CAST(@AddressId AS nvarchar) + '''';

IF @PersonId IS NOT NULL AND @PersonId != -1
SET @othercondition += ' AND request.ServicePersonId=''' + CAST(@PersonId AS nvarchar)  + '''';


IF @MobileNumber IS NOT NULL
SET @othercondition += ' AND customer.MobileNumber=''' + @MobileNumber + '''';

SET @othercondition += ' ORDER BY AddressLine1 ASC, request.ServiceDate DESC';


SET @sqlStmt = @sqlStmt + @whereCondition + @othercondition;
--select @sqlStmt
EXEC(@sqlStmt);




/****** Object:  StoredProcedure [dbo].[GetPendingVehicleServices]    Script Date: 2/23/2020 2:33:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetPendingVehicleServices]
(
@ServiceStatusId INT,
@ServiceDate Date,
@ServiceId INT,
@AddressId INT,
@PersonId INT,
@MobileNumber Nvarchar(20)
)
AS 

DECLARE @sqlStmt nvarchar(4000), @whereCondition nvarchar(1000) = '', @othercondition nvarchar(1000) = '';

SET @sqlStmt = 'SELECT (CASE WHEN child.ParentId IS NOT NULL THEN child.RequestId  WHEN child.ParentId IS NULL THEN request.RequestId END ) AS RequestId, request.VehicleId, request.ServiceType, Services.ServiceName, 
Services.ServiceId,Services.Price, Services.SubscriptionPrice, request.Frequency, request.ServiceStatusId, request.Promocode, vd.VehicleNumber, 
SubscriptionType.SubscribeType, vd.VehicleName, (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) AS ServiceDate, request.TimeSlot, request.RequestedOn, request.ServicePersonId,
vd.ParkingLot, Address.AddressLine1,  vd.VehicleTypeId, vpirce.SubscriptionPrice AS FourWheelerSubPrice, vpirce.Price AS FourWheelerOncePrice,
user_ref.UserFirstName, user_ref.UserLastName, user_ref.MobileNumber, request.Quantity, request.ParentId, child.ServiceDate AS ChildServiceDate,
child.ParentId AS ChildParentId, (select Amount from GetVehiclePriceByRequestId(request.RequestId)) AS RequestPrice,
otherAddress.AddressLine1 AS OtherAddressLine1, otherAddress.AddressLine2 AS OtherAddressLine2, otherAddress.AddressId AS OtherAddressId,
customer.UserFirstName AS CustomerFirstName, customer.UserLastName AS CustomerLastName, customer.MobileNumber AS CustomerMobileNumber
FROM VehicleRequestedServices request
JOIN Services
ON Services.ServiceId = request.ServiceId
LEFT JOIN VehicleDetails vd
ON vd.VehicleId = request.VehicleId
LEFT JOIN SubscriptionType
ON SubscriptionType.SubscribeId = request.Frequency
LEFT JOIN Address
ON Address.AddressId = vd.AddressId
LEFT JOIN VehicleServicePrice vpirce
ON vpirce.ServiceId = request.ServiceId AND vpirce.VehicleCategoryType = vd.FourWheelerTypeId
LEFT JOIN user_ref
ON user_ref.UserId = request.ServicePersonId
JOIN user_ref customer
ON customer.UserId = request.UserId
LEFT JOIN Address otherAddress
ON otherAddress.AddressId = request.OtherAddressId 
LEFT JOIN VehicleRequestedServices child 
ON child.ParentId = request.RequestId';

SET @whereCondition = ' WHERE (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceStatusId WHEN child.ParentId IS NULL THEN request.ServiceStatusId END ) = ''' +  CAST(@ServiceStatusId AS nvarchar)  + ''' ';

IF  @ServiceDate IS NOT NULL
BEGIN
	IF @ServiceStatusId = 1
		BEGIN
		
			SET @whereCondition += ' AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate WHEN request.ServiceType = 2 THEN  request.ServiceDate END) = ''' + CAST(@ServiceDate AS nvarchar)  + ''' '; 
			SET @othercondition += ' AND request.ParentId IS NULL '
		END
	ELSE
		SET @othercondition += ' AND request.ParentId IS NULL AND (CASE WHEN child.ParentId IS NOT NULL THEN child.ServiceDate  WHEN child.ParentId IS NULL THEN request.ServiceDate END ) = ''' + CAST(@ServiceDate AS nvarchar)  + ''' '
END

IF @ServiceId IS NOT NULL AND @ServiceId != -1
SET @othercondition += ' AND request.ServiceId=''' + CAST(@ServiceId AS nvarchar) + '''';


IF @AddressId IS NOT NULL AND @AddressId != -1
SET @othercondition += ' AND vd.AddressId=''' + CAST(@AddressId AS nvarchar) + '''';

IF @PersonId IS NOT NULL AND @PersonId != -1
SET @othercondition += ' AND request.ServicePersonId=''' + CAST(@PersonId AS nvarchar)  + '''';

IF @MobileNumber IS NOT NULL
SET @othercondition += ' AND customer.MobileNumber=''' + @MobileNumber + '''';

SET @othercondition += ' ORDER BY AddressLine1 ASC, request.ServiceDate DESC';


SET @sqlStmt = @sqlStmt + @whereCondition + @othercondition;
--select @sqlStmt
EXEC(@sqlStmt);




/****** Object:  StoredProcedure [dbo].[SaveVehicleRequest]    Script Date: 2/23/2020 3:34:26 PM ******/
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
	SELECT @ErrorMessage AS ErrorMessage, @ErrorCode AS ErrorCode, @RequestId as RequestId, Email, MobileNumber, UserFirstName
	FROM user_ref WHERE UserId = @UserId;

	SELECT Services.ServiceId, ServiceName, VehicleNumber
	FROM Services
	JOIN VehicleRequestedServices request
	ON request.ServiceId = Services.ServiceId
	JOIN VehicleDetails vehicle
	ON vehicle.VehicleId = request.VehicleId
	Where RequestId = @RequestId;

	SELECT devices.* FROM user_ref customer
	JOIN UserDevices devices
	ON devices.UserId = customer.UserId
	WHERE customer.UserId = @UserId AND UserDeviceToken IS NOT NULL;

END





/****** Object:  StoredProcedure [dbo].[GetServiceDetail]    Script Date: 2/23/2020 3:51:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetServiceDetail]
(@ServiceId INT)
AS 

SELECT ServiceId, ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage,
ServiceDescription, ServiceOrder, VehicleCategoryType, IsSubscriptionEnabled, IsPurchaseOnceEnabled, IsFrequent, Discount
FROM Services 
WHERE ServiceId = @ServiceId;

SELECT VehicleTypeId, VehicleTypeName
FROM VehicleTypes
WHERE VehicleTypes.StatusId = 1;


SELECT DISTINCT fwv.Id, fwv.VehicleType, vPrice.Price, vPrice.SubscriptionPrice, vPrice.VehicleCategoryType
FROM FourWheelerVehicleTypes fwv
JOIN VehicleTypes
ON VehicleTypes.VehicleTypeId = fwv.VehicleTypeId
LEFT JOIN VehicleServicePrice vPrice
ON vPrice.VehicleCategoryType = fwv.Id AND vPrice.ServiceId = @ServiceId
WHERE VehicleTypes.StatusId = 1 AND fwv.StatusId = 1;

SELECT * FROM SubscriptionType
WHERE StatusId=1 

SELECT SubscribeTypeId FROM ServiceSubscriptionTypes subTypes
JOIN Services
ON Services.ServiceId = subTypes.ServiceId
WHERE Services.ServiceId = @ServiceId 

SELECT sCategory.VehicleCategoryType FROM ServiceVehicleSubCategories sCategory
JOIN Services
ON Services.ServiceId = sCategory.ServiceId
WHERE Services.ServiceId = @ServiceId;

SELECT * FROM TimeSlots WHERE StatusId = 1


/****** Object:  UserDefinedTableType [dbo].[CartItemsQuantity]    Script Date: 2/23/2020 4:51:51 PM ******/
CREATE TYPE [dbo].ServiceTimeSlots AS TABLE(
	[TimeSlotId] [int] NULL
)
GO


CREATE TABLE ServiceTimeSlots
(
TimeSlotId INT,
ServiceId INT
)



/****** Object:  StoredProcedure [dbo].[SaveServiceDetails]    Script Date: 2/23/2020 4:26:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[SaveServiceDetails]
@ServiceId INT,
@ServiceName Nvarchar(100),
@IsEnabled INT,
@ServiceImage TEXT,
@ServiceDescription Text,
@SubscriptionPrice money,
@Price money,
@VehicleCategoryType INT,
@IsSubscriptionEnabled INT,
@IsPurchaseOnceEnabled INT,
@ServiceFourWheelerTypes ServiceFourWheelerTypes Readonly,
@ServiceSubscriptionTypes ServiceSubscriptionTypes Readonly,
@VehicleServicePrice VehicleServicePrice Readonly,
@ServiceOrder INT,
@IsFrequent INT,
@Discount Float,
@ServiceTimeSlots ServiceTimeSlots Readonly
AS 

IF @ServiceId IS NUll OR @ServiceId = -1
BEGIN
	INSERT INTO Services
	(ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage, ServiceDescription, VehicleCategoryType,
	IsSubscriptionEnabled, IsPurchaseOnceEnabled, ServiceOrder, IsFrequent, Discount)
	VALUES(@ServiceName, @IsEnabled, @SubscriptionPrice, @Price, 0, 1, @ServiceImage, @ServiceDescription, @VehicleCategoryType,
	@IsSubscriptionEnabled, @IsPurchaseOnceEnabled, @ServiceOrder, @IsFrequent, @Discount);
	SELECT @ServiceId = SCOPE_IDENTITY()
END
ELSE
BEGIN
	UPDATE Services
		SET ServiceName=@ServiceName, IsEnabled=@IsEnabled, SubscriptionPrice=@SubscriptionPrice, Price=@Price, 
		ServiceImage=@ServiceImage, ServiceDescription=@ServiceDescription, VehicleCategoryType = @VehicleCategoryType,
		IsSubscriptionEnabled = @IsSubscriptionEnabled, IsPurchaseOnceEnabled = @IsPurchaseOnceEnabled,
		ServiceOrder = @ServiceOrder, IsFrequent = @IsFrequent, Discount = @Discount
	WHERE ServiceId = @ServiceId;

	DELETE FROM ServiceVehicleSubCategories WHERE ServiceId = @ServiceId;
	DELETE FROM ServiceSubscriptionTypes WHERE ServiceId = @ServiceId;
	DELETE FROM VehicleServicePrice WHERE ServiceId = @ServiceId;
	DELETE FROM ServiceTimeSlots WHERE ServiceId = @ServiceId;

END

INSERT INTO ServiceSubscriptionTypes(ServiceId, SubscribeTypeId)
SELECT @ServiceId, SubscribeTypeId
FROM @ServiceSubscriptionTypes;

IF @VehicleCategoryType = 2
BEGIN
	INSERT INTO ServiceVehicleSubCategories(ServiceId, VehicleCategoryType, VehicleTypeId)
	SELECT @ServiceId, VehicleCategoryType, @VehicleCategoryType
	FROM @ServiceFourWheelerTypes;

	INSERT INTO VehicleServicePrice(ServiceId, VehicleCategoryType, SubscriptionPrice, Price)
	SELECT @ServiceId, VehicleCategoryId, SubscriptionPrice, Price
	FROM @VehicleServicePrice;
END

INSERT INTO ServiceTimeSlots(TimeSlotId, ServiceId)
SELECT TimeSlotId, @ServiceId
FROM @ServiceTimeSlots;


SELECT @ServiceId AS ServiceId;




/****** Object:  StoredProcedure [dbo].[GetServiceDetail]    Script Date: 2/23/2020 5:01:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetServiceDetail]
(@ServiceId INT)
AS 

SELECT ServiceId, ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage,
ServiceDescription, ServiceOrder, VehicleCategoryType, IsSubscriptionEnabled, IsPurchaseOnceEnabled, IsFrequent, Discount
FROM Services 
WHERE ServiceId = @ServiceId;

SELECT VehicleTypeId, VehicleTypeName
FROM VehicleTypes
WHERE VehicleTypes.StatusId = 1;


SELECT DISTINCT fwv.Id, fwv.VehicleType, vPrice.Price, vPrice.SubscriptionPrice, vPrice.VehicleCategoryType
FROM FourWheelerVehicleTypes fwv
JOIN VehicleTypes
ON VehicleTypes.VehicleTypeId = fwv.VehicleTypeId
LEFT JOIN VehicleServicePrice vPrice
ON vPrice.VehicleCategoryType = fwv.Id AND vPrice.ServiceId = @ServiceId
WHERE VehicleTypes.StatusId = 1 AND fwv.StatusId = 1;

SELECT * FROM SubscriptionType
WHERE StatusId=1 

SELECT SubscribeTypeId FROM ServiceSubscriptionTypes subTypes
JOIN Services
ON Services.ServiceId = subTypes.ServiceId
WHERE Services.ServiceId = @ServiceId 

SELECT sCategory.VehicleCategoryType FROM ServiceVehicleSubCategories sCategory
JOIN Services
ON Services.ServiceId = sCategory.ServiceId
WHERE Services.ServiceId = @ServiceId;

SELECT * FROM TimeSlots WHERE StatusId = 1

SELECT TimeSlotId FROM ServiceTimeSlots timeslot
JOIN Services
ON Services.ServiceId = timeslot.ServiceId
WHERE Services.ServiceId = @ServiceId;


CREATE PROCEDURE dbo.GetAllServices
AS 

	SELECT ServiceId, ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage, ServiceDescription
	FROM Services;


    ALTER TABLE Services ADD ServiceOrder int NULL GO

EXEC RoomTempo_Dev_ISS.sys.sp_rename 'RoomTempo_Dev_ISS.dbo.SubscriptionType.SubsribeId' , 'SubscribeId', 'COLUMN' GO


ALTER TABLE RoomTempo_Dev_ISS.dbo.Services ADD VehicleCategoryType int NULL GO

ALTER TABLE RoomTempo_Dev_ISS.dbo.Services ADD IsSubscriptionEnabled int NULL GO
ALTER TABLE RoomTempo_Dev_ISS.dbo.Services ADD IsPurchaseOnceEnabled int NULL GO


CREATE TABLE VehicleServicePrice (
	Id int IDENTITY(1,1) NOT NULL,
	ServiceId int NOT NULL,
	VehicleCategoryType int NOT NULL,
	SubscribeType int NOT NULL,
	Price money NOT NULL
) GO



CREATE TABLE ServiceVehicleSubCategories (
	Id int IDENTITY(1,1) NOT NULL,
	ServiceId INT NOT NULL,
	VehicleCategoryType INT NOT NULL,
	VehicleTypeId INT NOT NULL
)


CREATE TABLE ServiceSubscriptionTypes (
	Id int IDENTITY(1,1) NOT NULL,
	ServiceId INT NOT NULL,
	SubscribeTypeId INT NOT NULL
)




CREATE TYPE VehicleServicePrice AS TABLE(
	VehicleCategoryId INT,
    SubscriptionPrice money,
	Price money
)

CREATE TYPE ServiceVehicleSubCategories AS TABLE(
    VehicleCategoryType INT
)

CREATE TYPE ServiceSubscriptionTypes AS TABLE(
	SubscribeTypeId INT
)



CREATE PROCEDURE dbo.GetAllServices
AS 

DROP TABLE IF EXISTS #ServiceSubScriptions;
CREATE TABLE #ServiceSubScriptions(
	ServiceId INT,
	Subscriptions Nvarchar(100)
)

INSERT INTO #ServiceSubScriptions(ServiceId, Subscriptions)
SELECT  Services.ServiceId, STRING_AGG(SubscriptionType.SubscribeType, ',')
FROM ServiceSubscriptionTypes serviceSubTypes
JOIN SubscriptionType
ON serviceSubTypes.SubscribeTypeId = SubscriptionType.SubscribeId
JOIN Services 
ON Services.ServiceId = serviceSubTypes.ServiceId GROUP BY Services.ServiceId;


SELECT Services.ServiceId, ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage, ServiceDescription,
subscription.Subscriptions
FROM Services
JOIN #ServiceSubScriptions subscription
ON subscription.ServiceId = Services.ServiceId;



CREATE PROCEDURE dbo.SaveServiceDetails
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
@VehicleServicePrice VehicleServicePrice Readonly
AS 

IF @ServiceId IS NUll OR @ServiceId = -1
BEGIN
	INSERT INTO Services
	(ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage, ServiceDescription, VehicleCategoryType,
	IsSubscriptionEnabled, IsPurchaseOnceEnabled)
	VALUES(@ServiceName, @IsEnabled, @SubscriptionPrice, @Price, 0, 1, @ServiceImage, @ServiceDescription, @VehicleCategoryType,
	@IsSubscriptionEnabled, @IsPurchaseOnceEnabled);
	SELECT @ServiceId = SCOPE_IDENTITY()
END
ELSE
BEGIN
	UPDATE Services
		SET ServiceName=@ServiceName, IsEnabled=@IsEnabled, SubscriptionPrice=@SubscriptionPrice, Price=@Price, 
		ServiceImage=@ServiceImage, ServiceDescription=@ServiceDescription, VehicleCategoryType = @VehicleCategoryType,
		IsSubscriptionEnabled = @IsSubscriptionEnabled, IsPurchaseOnceEnabled = @IsPurchaseOnceEnabled
	WHERE ServiceId = @ServiceId;

	DELETE FROM ServiceVehicleSubCategories WHERE ServiceId = @ServiceId;
	DELETE FROM ServiceSubscriptionTypes WHERE ServiceId = @ServiceId;
	DELETE FROM VehicleServicePrice WHERE ServiceId = @ServiceId;

END

INSERT INTO ServiceVehicleSubCategories(ServiceId, VehicleCategoryType, VehicleTypeId)
SELECT @ServiceId, VehicleCategoryType, @VehicleCategoryType
FROM @ServiceFourWheelerTypes;

INSERT INTO ServiceSubscriptionTypes(ServiceId, SubscribeTypeId)
SELECT @ServiceId, SubscribeTypeId
FROM @ServiceSubscriptionTypes;

INSERT INTO VehicleServicePrice(ServiceId, VehicleCategoryType, SubscriptionPrice, Price)
SELECT @ServiceId, VehicleCategoryId, SubscriptionPrice, Price
FROM @VehicleServicePrice;

SELECT @ServiceId AS ServiceId;





CREATE PROCEDURE dbo.GetServiceDetail
(@ServiceId INT)
AS 

SELECT ServiceId, ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage,
ServiceDescription, ServiceOrder, VehicleCategoryType, IsSubscriptionEnabled, IsPurchaseOnceEnabled
FROM Services 
WHERE ServiceId = @ServiceId AND IsEnabled = 1;

SELECT VehicleTypeId, VehicleTypeName
FROM VehicleTypes
WHERE VehicleTypes.StatusId = 1;


SELECT DISTINCT fwv.Id, fwv.VehicleType, vPrice.Price, vPrice.SubscriptionPrice, vPrice.VehicleCategoryType
FROM FourWheelerVehicleTypes fwv
JOIN VehicleTypes
ON VehicleTypes.VehicleTypeId = fwv.VehicleTypeId
LEFT JOIN VehicleServicePrice vPrice
ON vPrice.VehicleCategoryType = fwv.VehicleTypeId AND vPrice.ServiceId = @ServiceId
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




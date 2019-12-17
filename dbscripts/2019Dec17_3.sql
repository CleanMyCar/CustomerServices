CREATE PROCEDURE dbo.GetServiceList
@SearchText Nvarchar(50),
@NumberOfRecords INT
AS 

DECLARE @SQL nvarchar(1000)

DROP TABLE IF EXISTS #ServiceSubScriptions;
DROP TABLE IF EXISTS #ServicePrices;
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

CREATE TABLE #ServicePrices(
	ServiceId INT,
	Price money,
	SubscriptionPrice money
)

INSERT INTO #ServicePrices(ServiceId, Price, SubscriptionPrice)
SELECT prices.ServiceId, MIN(prices.Price), Min(prices.SubscriptionPrice)
FROM VehicleServicePrice prices
JOIN Services
ON Services.ServiceId = prices.ServiceId
Group By prices.ServiceId


IF @SearchText IS NULL AND @NumberOfRecords = -1

	SELECT TOP 20 Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, Services.CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice,
	IsPurchaseOnceEnabled, IsSubscriptionEnabled, Services.VehicleCategoryType, VehicleTypeName
	FROM Services
	JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId 
	JOIN VehicleTypes
	ON VehicleTypeId = Services.VehicleCategoryType
	WHERE IsEnabled = 1;

ELSE IF @SearchText IS NULL AND @NumberOfRecords != -1
BEGIN	
	SELECT Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, Services.CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice, IsPurchaseOnceEnabled, 
	IsSubscriptionEnabled, Services.VehicleCategoryType, VehicleTypeName
	FROM Services
	JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId 
	JOIN VehicleTypes
	ON VehicleTypeId = Services.VehicleCategoryType
	WHERE IsEnabled = 1
END
ELSE
BEGIN
	
	SET @SQL = 'SELECT TOP 20 Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, Services.CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice, IsPurchaseOnceEnabled, 
	IsSubscriptionEnabled, Services.VehicleCategoryType, VehicleTypeName
	FROM Services
	JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId JOIN VehicleTypes
	ON VehicleTypeId = Services.VehicleCategoryType WHERE IsEnabled = 1 AND ServiceName LIkE ''%' + @SearchText + '%'''
	 
	EXEC (@SQL);
END


SELECT * FROM VehicleTypes;






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



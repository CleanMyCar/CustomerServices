CREATE PROCEDURE dbo.GetAllServices
AS 

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

SELECT Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, CategoryId, ServiceImage, ServiceDescription,
subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice
FROM Services
JOIN #ServiceSubScriptions subscription
ON subscription.ServiceId = Services.ServiceId
JOIN #ServicePrices prices
ON Services.ServiceId = prices.ServiceId;




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

	SELECT TOP 20 Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice,
	IsPurchaseOnceEnabled, IsSubscriptionEnabled
	FROM Services
	JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId WHERE IsEnabled = 1;

ELSE IF @SearchText IS NULL AND @NumberOfRecords != -1
BEGIN	
	SELECT Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice, IsPurchaseOnceEnabled, IsSubscriptionEnabled
	FROM Services
	JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId WHERE IsEnabled = 1
END
ELSE
BEGIN
	
	SET @SQL = 'SELECT TOP 20 Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice, IsPurchaseOnceEnabled, IsSubscriptionEnabled
	FROM Services
	JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId WHERE IsEnabled = 1 AND ServiceName LIkE ''%' + @SearchText + '%'''
	 
	EXEC (@SQL);
END





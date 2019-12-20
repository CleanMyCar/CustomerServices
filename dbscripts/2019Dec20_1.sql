CREATE PROCEDURE dbo.GetAllServices
AS 

DROP TABLE IF EXISTS #ServiceSubScriptions;
DROP TABLE IF EXISTS #ServicePrices;
CREATE TABLE #ServiceSubScriptions(
	ServiceId INT,
	Subscriptions Nvarchar(100)
)

INSERT INTO #ServiceSubScriptions(ServiceId, Subscriptions)
SELECT  Services.ServiceId, STRING_AGG(SubscriptionType.SubscribeType, ', ')
FROM ServiceSubscriptionTypes serviceSubTypes
LEFT JOIN SubscriptionType
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

SELECT Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, CategoryId,
ServiceImage, ServiceDescription, Services.VehicleCategoryType,
subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice
FROM Services
LEFT JOIN #ServiceSubScriptions subscription
ON subscription.ServiceId = Services.ServiceId
LEFT JOIN #ServicePrices prices
ON Services.ServiceId = prices.ServiceId;

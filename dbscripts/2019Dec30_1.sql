USE [master]
GO
/****** Object:  StoredProcedure [dbo].[GetAllServices]    Script Date: 12/30/2019 10:31:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetAllServices]
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
ServiceImage, ServiceDescription, Services.VehicleCategoryType,ServiceOrder, IsFrequent,
subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice
FROM Services
LEFT JOIN #ServiceSubScriptions subscription
ON subscription.ServiceId = Services.ServiceId
LEFT JOIN #ServicePrices prices
ON Services.ServiceId = prices.ServiceId;







####################################################


USE [master]
GO
/****** Object:  StoredProcedure [dbo].[GetServiceList]    Script Date: 12/30/2019 10:24:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetServiceList]
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
	IsPurchaseOnceEnabled, IsSubscriptionEnabled, Services.VehicleCategoryType, VehicleTypeName, ServiceOrder, IsFrequent
	FROM Services
	LEFT JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	LEFT JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId 
	JOIN VehicleTypes
	ON VehicleTypeId = Services.VehicleCategoryType
	WHERE IsEnabled = 1;

ELSE IF @SearchText IS NULL AND @NumberOfRecords != -1
BEGIN	
	SELECT Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, Services.CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice, IsPurchaseOnceEnabled, 
	IsSubscriptionEnabled, Services.VehicleCategoryType, VehicleTypeName, ServiceOrder, IsFrequent
	FROM Services
	LEFT JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	LEFT JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId 
	JOIN VehicleTypes
	ON VehicleTypeId = Services.VehicleCategoryType
	WHERE IsEnabled = 1
END
ELSE
BEGIN
	
	SET @SQL = 'SELECT TOP 20 Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, Services.CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice, IsPurchaseOnceEnabled, 
	IsSubscriptionEnabled, Services.VehicleCategoryType, VehicleTypeName, ServiceOrder, IsFrequent
	FROM Services
	LEFT JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	LEFT JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId JOIN VehicleTypes
	ON VehicleTypeId = Services.VehicleCategoryType WHERE IsEnabled = 1 AND ServiceName LIkE ''%' + @SearchText + '%'''
	 
	EXEC (@SQL);
END


SELECT * FROM VehicleTypes;

#################################################################

USE [master]
GO
/****** Object:  StoredProcedure [dbo].[GetServiceDetail]    Script Date: 12/30/2019 10:23:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetServiceDetail]
(@ServiceId INT)
AS 

SELECT ServiceId, ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage,
ServiceDescription, ServiceOrder, VehicleCategoryType, IsSubscriptionEnabled, IsPurchaseOnceEnabled, IsFrequent
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


###########################################################

CREATE PROCEDURE UpdateServiceFrequencyFlag(
@IsFrequent INT,
@ServiceId INT
)
AS

UPDATE Services SET IsFrequent = @IsFrequent WHERE ServiceId = @ServiceId;

SELECT @ServiceId AS ServiceId;


###########################################################

USE [master]
GO
/****** Object:  StoredProcedure [dbo].[SaveServiceDetails]    Script Date: 12/30/2019 10:07:32 PM ******/
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
@IsFrequent INT
AS 

IF @ServiceId IS NUll OR @ServiceId = -1
BEGIN
	INSERT INTO Services
	(ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage, ServiceDescription, VehicleCategoryType,
	IsSubscriptionEnabled, IsPurchaseOnceEnabled, ServiceOrder, IsFrequent)
	VALUES(@ServiceName, @IsEnabled, @SubscriptionPrice, @Price, 0, 1, @ServiceImage, @ServiceDescription, @VehicleCategoryType,
	@IsSubscriptionEnabled, @IsPurchaseOnceEnabled, @ServiceOrder, @IsFrequent);
	SELECT @ServiceId = SCOPE_IDENTITY()
END
ELSE
BEGIN
	UPDATE Services
		SET ServiceName=@ServiceName, IsEnabled=@IsEnabled, SubscriptionPrice=@SubscriptionPrice, Price=@Price, 
		ServiceImage=@ServiceImage, ServiceDescription=@ServiceDescription, VehicleCategoryType = @VehicleCategoryType,
		IsSubscriptionEnabled = @IsSubscriptionEnabled, IsPurchaseOnceEnabled = @IsPurchaseOnceEnabled,
		ServiceOrder = @ServiceOrder, IsFrequent = @IsFrequent
	WHERE ServiceId = @ServiceId;

	DELETE FROM ServiceVehicleSubCategories WHERE ServiceId = @ServiceId;
	DELETE FROM ServiceSubscriptionTypes WHERE ServiceId = @ServiceId;
	DELETE FROM VehicleServicePrice WHERE ServiceId = @ServiceId;

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

SELECT @ServiceId AS ServiceId;


##########################################################################


CREATE PROCEDURE GetFrequentServices 
AS
BEGIN

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

SELECT Services.ServiceId, ServiceName, IsEnabled, Services.SubscriptionPrice, Services.Price, OldPrice, Services.CategoryId, ServiceImage, ServiceDescription,
	subscription.Subscriptions, prices.Price as StartingPrice, prices.SubscriptionPrice as StartingSubscriptionPrice, IsPurchaseOnceEnabled, 
	IsSubscriptionEnabled, Services.VehicleCategoryType, VehicleTypeName, ServiceOrder, IsFrequent
	FROM Services
	LEFT JOIN #ServiceSubScriptions subscription
	ON subscription.ServiceId = Services.ServiceId
	LEFT JOIN #ServicePrices prices
	ON Services.ServiceId = prices.ServiceId 
	JOIN VehicleTypes
	ON VehicleTypeId = Services.VehicleCategoryType
	WHERE IsEnabled = 1 AND IsFrequent = 1
END


##################################################################

USE [master]
GO
/****** Object:  StoredProcedure [dbo].[UpdateServiceFrequencyFlag]    Script Date: 12/30/2019 11:11:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateServiceOrder](
@ServiceOrder INT,
@ServiceId INT
)
AS

UPDATE Services SET ServiceOrder = @ServiceOrder WHERE ServiceId = @ServiceId;

SELECT @ServiceId AS ServiceId;


################################################################################################################



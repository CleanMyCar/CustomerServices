USE [master]
GO
/****** Object:  StoredProcedure [dbo].[GetServiceDetail]    Script Date: 12/16/2019 10:54:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[GetServiceDetail]
(@ServiceId INT)
AS 

SELECT ServiceId, ServiceName, IsEnabled, SubscriptionPrice, Price, OldPrice, CategoryId, ServiceImage,
ServiceDescription, ServiceOrder, VehicleCategoryType, IsSubscriptionEnabled, IsPurchaseOnceEnabled
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
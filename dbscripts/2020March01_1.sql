/****** Object:  StoredProcedure [dbo].[PauseSubscription]    Script Date: 3/1/2020 9:00:40 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PauseSubscription]
@RequestId INT,
@ServicePauseDate DateTime,
@ServiceEndDate DateTime,
@UserId INT
AS 

DROP TABLE IF EXISTS #ServicePauseDatesItems;

CREATE TABLE #ServicePauseDatesItems(
	RequestId INT
)

INSERT INTO #ServicePauseDatesItems(RequestId)
SELECT RequestId FROM VehicleRequestedServices WHERE ParentId = @RequestId AND ServiceDate BETWEEN @ServicePauseDate AND @ServiceEndDate

UPDATE VehicleRequestedServices
SET UpdatedOn=getdate(), ServicePauseDate=@ServicePauseDate, ServiceEndDate=@ServiceEndDate, ServiceStatusId=2
WHERE RequestId = @RequestId;

UPDATE VehicleRequestedServices
SET ServiceStatusId=2
WHERE RequestId  IN (SELECT RequestId FROM #ServicePauseDatesItems);


SELECT RequestId, ServiceName, Email, MobileNumber FROM VehicleRequestedServices vservices
JOIN Services
ON Services.ServiceId = vservices.ServiceId
JOIN user_ref
ON user_ref.UserId = vservices.UserId
WHERE RequestId = @RequestId;


SELECT devices.* FROM user_ref customer
JOIN UserDevices devices
ON devices.UserId = customer.UserId
WHERE customer.UserId = @UserId AND UserDeviceToken IS NOT NULL;



/****** Object:  StoredProcedure [dbo].[ResumeSubscriptionItem]    Script Date: 3/1/2020 9:07:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[ResumeSubscriptionItem](
@RequestId INT,
@UserId INT
)
AS 
BEGIN

DECLARE @servicePersonId INT;
SET @servicePersonId = (SELECT ServicePersonId FROM VehicleRequestedServices WHERE RequestId = @RequestId)

UPDATE VehicleRequestedServices SET ServiceStatusId = (CASE WHEN @servicePersonId IS NULL THEN 1 ELSE 4 END)
WHERE ParentId = @RequestId AND ServiceStatusId = 2 AND ServiceDate >= FORMAT (getdate(), 'yyyy-MM-dd 00:00:00') ;

UPDATE VehicleRequestedServices SET ServicePauseDate = null, ServiceEndDate = null,
ServiceStatusId = (CASE WHEN @servicePersonId IS NULL THEN 1 ELSE 4 END)
WHERE RequestId = @RequestId;

SELECT @RequestId AS RequestId;

SELECT devices.* FROM user_ref customer
JOIN UserDevices devices
ON devices.UserId = customer.UserId
WHERE customer.UserId = @UserId AND UserDeviceToken IS NOT NULL;

END



/****** Object:  StoredProcedure [dbo].[DeleteSubscription]    Script Date: 3/1/2020 9:10:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[DeleteSubscription]
@RequestId INT,
@DeletedReasons RequestDeletedReasons Readonly,
@DeletedReason Nvarchar(500),
@UserId INT
AS 
UPDATE VehicleRequestedServices
SET DeletedReason = @DeletedReason, ServiceStatusId=3
WHERE RequestId = @RequestId;

UPDATE VehicleRequestedServices
SET DeletedReason = @DeletedReason, ServiceStatusId=3
WHERE ParentId = @RequestId AND ServiceStatusId IN (1, 2, 4);

INSERT INTO ServiceRequestDeletedReason(RequestId, ReasonId)
SELECT @RequestId, ReasonId From @DeletedReasons;

SELECT @RequestId AS RequestId;

SELECT devices.* FROM user_ref customer
JOIN UserDevices devices
ON devices.UserId = customer.UserId
WHERE customer.UserId = @UserId AND UserDeviceToken IS NOT NULL;

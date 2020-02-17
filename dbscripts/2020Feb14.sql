
CREATE TABLE UserDevices(
    UserDeviceId INT IDENTITY(1,1),
    UserDeviceToken Nvarchar(500),
    UserDeviceType Nvarchar(20),
    UserId INT
)

CREATE PROCEDURE GetBannerImageById(
@ImageId INT
)
AS
BEGIN
SELECT * FROM BannerImages WHERE ImageId = @ImageId;
END


/****** Object:  StoredProcedure [dbo].[GetBannerImages]    Script Date: 2/17/2020 10:46:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER  PROCEDURE [dbo].[GetBannerImages](@isLogin int, @source nvarchar(10))

AS

BEGIN
IF @source = 'Web'
SELECT ImageId, ImageName, Image  FROM BannerImages WHERE StatusId = 1 AND isLogin = @isLogin;
ELSE
SELECT ImageId, ImageName  FROM BannerImages WHERE StatusId = 1 AND isLogin = @isLogin;
END
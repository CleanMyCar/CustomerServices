CREATE PROCEDURE dbo.GetMyServiceProducts
@UserId INT,
@ServiceId INT
AS 
SELECT VehicleId, VehicleNumber, VehicleMake, VehicleModel, ParkingLot, AddressId, IsPersonal, VehicleTypeId, 
FourWheelerTypeId, StatusId, UserId, VehicleImage
FROM VehicleDetails
JOIN Services
ON Services.VehicleCategoryType = VehicleTypeId
WHERE UserId=@UserId AND StatusId = 1 AND ServiceId = @ServiceId;
 



CREATE PROCEDURE [dbo].[ValidateUser] 
@Email VARCHAR(50) ,
@Password NVARCHAR(50)

AS
BEGIN

	DECLARE @userid INT	, @UserRoleId INT

	SELECT UserId, UserRoleId, Email
	FROM user_ref
		WHERE (email = @Email OR MobileNumber = @Email)
		AND userPassword = @Password
		AND StatusId = 1;
	
END


	


CREATE PROCEDURE [dbo].[SaveUserDetail] 
	@UserId INT,
	@UserLastName NVARCHAR(50),
	@UserFirstName NVARCHAR(50),
	@Email NVARCHAR(100),
	@UserPassword NVARCHAR(500),
	@StatusId INT,
	@LoggedinUser INT,
	@ProfileImage NVARCHAR(MAX),
	@MobileNumber NVARCHAR(100),
	@ReferralCode NVARCHAR(100),
	@UserOtp NVARCHAR(10),
	@UserRoleId INT
AS
BEGIN
	DECLARE @ErrorMessage NVARCHAR(255)
		   ,@ErrorSeverity NVARCHAR(MAX)
		   ,@PswrdExpiryDate DATE
		   ,@RowCount	INT		   
		   ,@UTCDate DATETIME 

	SELECT
		@ErrorMessage = ''
	   ,@ErrorSeverity = -1
	   ,@PswrdExpiryDate = DATEADD(DAY,60,GETUTCDATE())
	   ,@RowCount = 0
	   ,@UTCDate = GETUTCDATE()

	

		IF @userID IS NULL OR @userID = -1
		BEGIN
			IF EXISTS ( SELECT 1 FROM user_ref
								WHERE Email = @Email OR MobileNumber = @MobileNumber)
			BEGIN
				SELECT @ErrorMessage = 'Email/Mobile Number already exists !!' 
			END
			ELSE
			BEGIN
				INSERT INTO user_ref (
				userLastName,
				userFirstName,
				email,
				userPassword,
				StatusId,
				UpdatedBy,
				DateUpdated,
				ProfileImage,
				MobileNumber,
				ReferralCode,
				UserOtp,
				UserRoleId)
					SELECT
						@userLastName
						,@userFirstName
						,@email
						,@userPassword
						,@StatusId
						,@LoggedinUser
						,@UTCDate
						,@ProfileImage
						,@MobileNumber
						,@ReferralCode
						,@UserOtp
						,@UserRoleId

				SELECT @userID = SCOPE_IDENTITY()
				
				INSERT INTO Wallet
				(Amount, UserId)
				VALUES(0.00, @userID);

										
				SELECT 'User Details Saved Successfully!!' AS Success  

				SET @RowCount = @RowCount + 1
			END
		END	
		ELSE
		BEGIN
			UPDATE user_ref SET
				userLastName = @userLastName,
				userFirstName = @userFirstName,
				ProfileImage = @ProfileImage
		END
		

	SELECT @ErrorMessage AS ErrorMessage ,@ErrorSeverity AS ErrorSeverity;

	SELECT @userID AS UserId;
END


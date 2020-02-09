USE [master]
GO
/****** Object:  StoredProcedure [dbo].[SaveUserDetail]    Script Date: 2/8/2020 10:32:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SaveUserDetail] 
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
	@UserRoleId INT,
	@IsMobileNumberVerified INT
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
				UserRoleId,
				IsMobileNumberVerified)
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
						,@IsMobileNumberVerified

				SELECT @userID = SCOPE_IDENTITY()
				
				INSERT INTO Wallet
				(Amount, UserId)
				VALUES(0.00, @userID);

				DELETE FROM register_user_ref WHERE Email = @Email OR MobileNumber = @MobileNumber;

			END
		END	
		ELSE
		BEGIN
			UPDATE user_ref SET
				userLastName = @userLastName,
				userFirstName = @userFirstName,
				ProfileImage = @ProfileImage,
				UserRoleId = @UserRoleId
				WHERE UserId = @UserId;
		END
		

	SELECT @ErrorMessage AS ErrorMessage ,@ErrorSeverity AS ErrorSeverity;

	SELECT @userID AS UserId;
END


alter table Wallet add ExpiryDate Date;

CREATE TABLE Configurations(NewUserRechargeAmount money, ValidUpto INT, SmsNotifications INT, EmailNotifications INT)

INSERT INTO Configurations values(150, 15, 0, 0);


CREATE PROCEDURE GetConfigurations
AS
BEGIN
	select * from Configurations;
END


USE [master]
GO
/****** Object:  StoredProcedure [dbo].[SaveAddress]    Script Date: 2/9/2020 10:38:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[SaveAddress](
@AddressId INT,
@AddressLine1 Nvarchar(500),
@AddressLine2 Nvarchar(500),
@Landmark Nvarchar(500),
@CountryId INT,
@StateId INT,
@CityId INT,
@Pincode INT,
@IsDefault INT,
@StatusId INT,
@UserId INT
)
AS

BEGIN

IF @IsDefault = 1
BEGIN

IF @UserId IS NOT NULL
UPDATE Address 
SET IsDefault = 0 
WHERE UserId = @UserId
END

IF @AddressId IS NULL OR @AddressId = -1
BEGIN
	INSERT INTO Address(AddressLine1, AddressLine2, Landmark, IsDefault, UserId, StatusId, Country, State, City, Pincode)
	VALUES (@AddressLine1, @AddressLine2, @Landmark, @IsDefault, @UserId, @StatusId, @CountryId, @StateId, @CityId, @Pincode)

	SELECT @AddressId = SCOPE_IDENTITY()
END
ELSE
BEGIN		
		IF @UserId IS NULL
		BEGIN
			UPDATE Address SET StatusId = 0 WHERE AddressId = @AddressId;
			
			INSERT INTO Address(AddressLine1, AddressLine2, Landmark, IsDefault, UserId, StatusId, Country, State, City, Pincode)
			VALUES (@AddressLine1, @AddressLine2, @Landmark, @IsDefault, @UserId, @StatusId, @CountryId, @StateId, @CityId, @Pincode)

			SELECT @AddressId = SCOPE_IDENTITY();
		END
		ELSE
			UPDATE Address 
			SET AddressLine1 = @AddressLine1, AddressLine2 = @AddressLine2, Landmark = @Landmark, IsDefault = @IsDefault,
			Country = @CountryId, State = @StateId, City = @CityId, Pincode = @Pincode
			WHERE AddressId = @AddressId;
END

SELECT @AddressId as AddressId;

END
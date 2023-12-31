USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Users_Select_Positions_MemberStatus]    Script Date: 7/5/2023 11:39:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Isaiah Jones
-- Create date: 2023-06-23
-- Description:Selects users with their game day positions and member status
-- Code Reviewer: Jaustin Buenaventura

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[Users_Select_Positions_MemberStatus] @ConferenceId int,
												   @TeamId int
as 

BEGIN  


/*----------------------------------------TEST CODE------------------------------------------------

				
			Declare @ConferenceId int = 1
			DECLARE @TeamId int = 6
				Execute dbo.Users_Select_Positions_MemberStatus @ConferenceId,
												   @TeamId
				
-------------------------------------------------------------------------------------------------*/



SELECT
	u.Id,
	u.FirstName,
	u.LastName,
	u.Mi,
	u.AvatarUrl,
	u.Email,
	PositionAssigned = (
			SELECT 
				gd.Id 
				,gd.[Name] 
			FROM dbo.TeamGameDayPositions AS tg 
				inner join dbo.GameDayPositions AS gd ON gd.Id = tg.GameDayPositionId
			WHERE tg.TeamId = @TeamId and tg.UserId = u.Id
			FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER
	),
	IsTeamMember = (SELECT CAST(CASE WHEN u.Id IN (SELECT UserId FROM dbo.TeamMembers WHERE TeamId = @TeamId) THEN 1 ELSE 0 END AS BIT))
FROM [AssignRef].[dbo].[ConferenceUsers] as cu
inner join dbo.Users as u on cu.userId = u.Id
Where [ConferenceId] = @ConferenceId

END
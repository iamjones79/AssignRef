USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[TeamGameDayPositions_SelectByTeamId]    Script Date: 7/5/2023 11:41:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Isaiah Jones
-- Create date: 6/13/2023
-- Description:Select from dbo.TeamGameDayPositions with inner joins to dbo.Teams and dbo.GameDayPositions

--			    
--Params:		None
-- Code Reviewer: 

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

ALTER proc [dbo].[TeamGameDayPositions_SelectByTeamId] @TeamId int

AS

/*	


	DECLARE @TeamId int = 6

	EXECUTE [dbo].[TeamGameDayPositions_SelectByGameId] @TeamId

*/

BEGIN

	SELECT tg.TeamId as TeamId
		  ,u.Id as UserId
		  ,u.FirstName
		  ,u.Mi
		  ,u.LastName 
		  ,u.AvatarUrl
		  ,gd.Id as PositionId
		  ,gd.[Name] 
	FROM dbo.TeamGameDayPositions AS tg
	inner join dbo.Users AS u
	ON u.Id = tg.UserId
	inner join dbo.GameDayPositions AS gd
	ON gd.Id = tg.GameDayPositionId

	WHERE tg.TeamId = @TeamId

END
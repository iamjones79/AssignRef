using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Microsoft.Extensions.Logging;
using Sabio.Web.Controllers;
using Sabio.Models.Requests.Games;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Requests.TeamGameDayPositions;
using Sabio.Models.Domain.Tests;
using Stripe;
using System.Collections.Generic;
using static System.Net.Mime.MediaTypeNames;
using Sabio.Models.Domain.TeamGameDayPosition;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/gamedaypositions")]
    [ApiController]
    public class TeamGameDayPositionsController : BaseApiController
    {
        private ITeamGameDayPositionServices _service = null;

        public TeamGameDayPositionsController(ITeamGameDayPositionServices service
           , ILogger<TeamGameDayPositionsController> logger) : base(logger)
        {
            _service = service;
 
        }
        [HttpPost]
        public ActionResult<SuccessResponse> Create(TeamGameDayPositionAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Add(model);
 
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
               
            }

            return StatusCode(code,response);
        }

        [HttpPut]
        public ActionResult<SuccessResponse> Update(TeamGameDayPositionAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);

            }

            return StatusCode(code, response);
        }

        [HttpGet("{conferenceId:int}/{teamId:int}")]
        public ActionResult<ItemResponse<List<TeamGameDayPosition>>> Get (int conferenceId, int teamId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<TeamGameDayPosition> gameDayPositions = _service.GetByTeamId(conferenceId, teamId);
                if (gameDayPositions == null)
                {
                    code = 404;
                    response = new ErrorResponse("Game Positions and Users not found");
                }
                else
                {
                    response = new ItemResponse<List<TeamGameDayPosition>> { Item = gameDayPositions };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

    }
}

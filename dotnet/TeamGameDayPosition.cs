using Sabio.Models.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.TeamGameDayPosition
{
    public class TeamGameDayPosition
    {
         

        public BaseUser User { get; set; }

        public string Email { get; set; }
        public LookUp GameDayPosition {get; set; }

        public Boolean IsMember { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Web.Http;

namespace AutoAlarmAnalyzer
{
    public class SimpleController : ApiController
    {
        private static readonly List<string> data = new List<string>();

        // GET api/simple
        [HttpGet]
        [Route("api/simple")]
        public IEnumerable<string> Get()
        {
            return data;
        }

        // POST api/simple
        [HttpPost]
        [Route("api/simple")]
        public IHttpActionResult Post([FromBody] string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return BadRequest("Invalid data");
            }

            data.Add(value);
            return Ok("Data added successfully");
        }
    }
}

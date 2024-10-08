using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Owin.Hosting;

namespace AutoAlarmAnalyzer
{
    public static class Program
    {
            static void Main(string[] args)
            {
                string baseAddress = "http://localhost:8080/";

                // Start OWIN host
                using (WebApp.Start<Startup>(url: baseAddress))
                {
                    Console.WriteLine($"Server running at {baseAddress}. Press Enter to exit.");
                    Console.ReadLine();
                }
            }
        
    }
}

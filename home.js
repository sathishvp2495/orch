$(document).ready(function () {

            /*From MSDN http://msdn.microsoft.com/en-us/library/hh921684.aspx
            Job
            Job parameter not in expected format. <Data><Parameter><ID></ID><Value></Value> </Parameter><Parameter> <ID></ID><Value></Value> </Parameter></Data>
            Occurs when the Parameter XML format is not valid.
            */
            /*

            */
            var paramJsonShort = {

                "RunbookId": "602f49fa-ab8b-497b-8499-b863dbebad5e",
        "Parameters":"<Data><Parameter><ID>{acc69c30-c8e9-40a4-ad02-6d68f40d8c1f}</ID><Value>Tester</Value></Parameter></Data>"
                 

            }

            var JobID;
            var datastring = JSON.stringify(paramJsonShort);
        console.log("datastring:::::::"+datastring);
            var orchurl = "http://sp2:81/Orchestrator2012/Orchestrator.svc/Jobs";
            $.ajax({
                url: orchurl,
                async: false,
                contentType: "application/json; charset=utf-8",
                type: "POST",
                data: datastring,
                dataType: 'json',
                success: function (json) {
                    JobID = json.d.Id;
                    alert(JobID);
                },
                error: function (json) {
                    alert(datastring + " || " + json.responseText);
                }
            });
        });
//ScheduledConverter receives a JSON array of raw IEX Agent Schedules report by MU or MU Set (raw).
//ScheduleConverter receives a function that expects a JSON OBJECT to export (exportConverted).
//Output an object { header, entries }
//// header: array with the fields IEX ID | AGENT | DATE | ACTIVITY | START | END.
//// entries: 2D matrix with the entries matching the header fields.
import { useContext } from "react"
import { DataContext } from "../../contexts/DataContextProvider"

const spec_string_to_date = (date_str) => {
  let output = new Date(date_str)
  return output
}

const AgentCalendarConverter = ({ raw, exportConverted }) => {
  const { setEntries } = useContext(DataContext)

  const handleConversion = () => {
    let data = raw

    let header = [
      "IEX ID",
      "STARTDATE",
      "STARTTIME",
      "ENDDATE",
      "ENDTIME",
      "PAYCODENAME",
      "NUMBEROFHOURS",
    ]

    let entries = []

    const ID_COL = 3
    const DATE_ROW = 9

    let all_day_activities = ["OFF", "PTO", "Absence"]

    let dates = []

    for (let j = 1; j < data[DATE_ROW].length; j++) {
      console.log(data[DATE_ROW])
      if (data[DATE_ROW][j]) {
        dates.push({
          date_obj: spec_string_to_date(data[DATE_ROW][j]),
          index: j,
        })
      }
    }

    for (let i = DATE_ROW - 1; i < data.length - 1; i++) {
      let agent_row = data[i]
      let schedules_row = data[i + 1]
      if (data[i][ID_COL]) {
        dates.forEach((date) => {
          let scheduled = schedules_row[date.index + 1]
          let is_all_day = all_day_activities.includes(scheduled)

          let start_time = is_all_day ? "" : parseInt(scheduled.split("-")[0])
          let end_time = is_all_day ? "" : parseInt(scheduled.split("-")[1])

          let start_date = [
            date.date_obj.getDate(),
            date.date_obj.getMonth(),
            date.date_obj.getFullYear(),
          ].join("/")

          let end_date_obj = new Date(date.date_obj.toDateString())
          start_time > end_time &&
            end_date_obj.setDate(end_date_obj.getDate() + 1)
          let end_date = [
            end_date_obj.getDate(),
            end_date_obj.getMonth(),
            end_date_obj.getFullYear(),
          ].join("/")

          scheduled &&
            entries.push([
              agent_row[ID_COL],
              start_date,
              start_time,
              end_date,
              end_time,
              is_all_day ? scheduled : "",
              is_all_day ? "to_map" : "",
            ])
        })
      }
    }

    exportConverted({ header, entries })
    setEntries({ data: [header, ...entries], type: "calendar" })
  }

  return (
    <button
      onClick={handleConversion}
      disabled={raw.length < 1}
      className="btn btn-outline-primary m-2"
    >
      Calendar
    </button>
  )
}

export default AgentCalendarConverter

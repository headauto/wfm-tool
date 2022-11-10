import { useState, useContext, Fragment } from "react"
import Head from "next/head"
import CSVUploader from "../components/csvHandlers/CSVUploader"
import SQLTable from "../components/displays/SQLTable"
import { CSVDownloader } from "react-papaparse"
import { DataContext } from "../contexts/DataContextProvider"

const AgentCalendar = () => {
  const { entries, setEntries } = useContext(DataContext)

  const [kronos, setKronos] = useState([])

  const [agentData, setAgentData] = useState({})
  const [specShifts, setSpecShifts] = useState({})

  const [mappings, setMappings] = useState({})

  const [loaded, setLoaded] = useState({
    calendar: false,
    agentData: false,
    mappings: false,
  })

  const [generated, setGenerated] = useState({
    kronos: false,
  })

  const [kronosCustomName, setKronosCustomName] = useState("")

  const handleUploadCalendar = (csv) => {
    setLoaded({ ...loaded, calendar: false })
    setEntries({ data: csv, type: "calendar" })
    setLoaded({ ...loaded, calendar: true })
  }

  const handleGenerateKronos = () => {
    setGenerated({ ...generated, kronos: false })

    let data = [...entries.data]
    const _IEXID = 0
    const _PAYCODE = 5
    const _NUMHOURS = 6

    console.log(data)

    //Input Validation
    if (data[0]) {
      if (data[0][0] !== "IEX ID") {
        console.log("BAD DATA on GENERATE KRONOS")
        return -1
      }
    }

    let newKronos = data.map((entry, index) => {
      let newEntry = entry.slice()
      if (index == 0) {
        newEntry[_IEXID] = "EMPID"
      } else {
        newEntry[_IEXID] =
          agentData[newEntry[_IEXID]] || `NF: ${newEntry[_IEXID]}`
        newEntry[_PAYCODE] = newEntry[_PAYCODE]
          ? mappings[newEntry[_PAYCODE]] || `NF: ${newEntry[_PAYCODE]}`
          : ""
        newEntry[_NUMHOURS] = specShifts[newEntry[_IEXID]] || 8
      }
      return newEntry
    })

    console.log(newKronos)

    setKronos(newKronos)

    setGenerated({ ...generated, kronos: true })
  }

  const handleUploadAgentData = (csv) => {
    setGenerated({ ...generated, kronos: false })
    setLoaded({ ...loaded, agentData: false })

    const _IEXID = 2
    const _BOOSTID = 3
    const _SPEC_SHIFT = 4

    let newAgentData = {}
    let newSpecShifts = {}

    csv.slice(1).forEach((entry) => {
      newAgentData[entry[_IEXID]] = entry[_BOOSTID]
      if (entry[_SPEC_SHIFT] !== "") {
        newSpecShifts[entry[_IEXID]] = entry[_SPEC_SHIFT]
      } else {
        newSpecShifts[entry[_IEXID]] = 8
      }
    })

    setAgentData(newAgentData)
    setSpecShifts(newSpecShifts)

    setLoaded({ ...loaded, agentData: true, specShifts: true })
  }

  const handleUploadMappings = (csv) => {
    setGenerated({ ...generated, kronos: false })
    setLoaded({ ...loaded, mappings: false })

    const _MAPPING = 1
    const _ACTIVITY = 0

    let newMappings = {}

    csv.slice(1).forEach((entry) => {
      newMappings[entry[_ACTIVITY]] = entry[_MAPPING]
    })

    setMappings(newMappings)

    setLoaded({ ...loaded, mappings: true })
  }

  return (
    <Fragment>
      <Head>
        <title>WFM TOOL - Agent Calendar & Kronos</title>
        <meta name="description" content="WFM Tool" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
      </Head>
      <main className="mb-4 container">
        <h2 className="text-center text-danger">SCHEDULES & KRONOS</h2>
        <div className="d-flex flex-column align-items-center text-center my-4">
          <h3 className="title-text">UPLOADS</h3>
          <div className="d-flex row">
            <div className="col">
              <CSVUploader
                loadedHandler={handleUploadCalendar}
                removeHandler={() => setLoaded({ ...loaded, calendar: false })}
                header={"Calendar CSV"}
              />
            </div>
            <div className="col">
              <CSVUploader
                loadedHandler={handleUploadAgentData}
                removeHandler={() => setLoaded({ ...loaded, agentData: false })}
                header={"Agent Data CSV"}
                label="Insert Agent Data CSV: PROJECT-NAME-IEXID-BOOSTID"
              />
            </div>
            <div className="col">
              <CSVUploader
                loadedHandler={handleUploadMappings}
                removeHandler={() => setLoaded({ ...loaded, mappings: false })}
                header={"Mappings CSV"}
                label="Insert Mappings CSV: ACTIVITY-MAPPING"
              />
            </div>
          </div>
        </div>

        <div className="container d-flex flex-column align-items-center text-center my-4">
          <h3>KRONOS</h3>
          <button
            className="btn btn-outline-dark btn-sm my-3"
            onClick={handleGenerateKronos}
            disabled={!entries}
          >
            Generate KRONOS
          </button>
          {generated.kronos && (
            <div className="d-flex border p-2 m-2 shadow-sm">
              <input
                type="text"
                placeholder="Custom File Name"
                value={kronosCustomName}
                onChange={(e) => setKronosCustomName(e.target.value)}
              ></input>
              <CSVDownloader
                data={kronos}
                filename={"Kronos_" + kronosCustomName}
                config={{ encoding: "ISO-8859-1" }}
              >
                <button className="btn btn-success btn-sm ms-2">
                  Download Kronos CSV
                </button>
              </CSVDownloader>
            </div>
          )}
          {kronos && generated.kronos && (
            <SQLTable
              title="Kronos Viewer"
              input={{
                data: { header: kronos[0], entries: kronos.slice(1) },
                isConverted: true,
              }}
            />
          )}
        </div>
      </main>
    </Fragment>
  )
}

export default AgentCalendar

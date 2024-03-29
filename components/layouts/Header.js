import Link from "next/link"
import { DataContext } from "../../contexts/DataContextProvider"
import { useContext } from "react"

const Header = () => {
  const { entries } = useContext(DataContext)

  return (
    <nav className="navbar">
      <div className="container">
        <a className="navbar-brand text-danger" href="/">
          WFM TOOL
        </a>

        <ul className="navbar-nav mr-auto d-flex flex-row align-items-center">
          <li className="nav-item">
            <Link href="/entry-converters">
              <a className="nav-link mx-3 border-bottom">Entry Converters</a>
            </Link>
          </li>

          <li className="nav-item">
            <Link href="/schedules">
              <a className="nav-link mx-3 border-bottom">
                Schedules{" "}
                {entries.type === "schedules" && (
                  <span className="badge bg-danger">E</span>
                )}
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/agent-calendar">
              <a className="nav-link mx-3 border-bottom">
                Calendar
                {entries.type === "calendar" && (
                  <span className="badge bg-danger">E</span>
                )}
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/adherence">
              <a className="nav-link mx-3 border-bottom">
                Adherence{" "}
                {entries.type === "adherence" && (
                  <span className="badge bg-danger">E</span>
                )}
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/intervals">
              <a className="nav-link mx-3 border-bottom">
                Intervals{" "}
                {entries.type === "intervals" && (
                  <span className="badge bg-danger">E</span>
                )}
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/intraday">
              <a className="nav-link mx-3 border-bottom">
                Intraday{" "}
                {entries.type === "intraday" && (
                  <span className="badge bg-danger">E</span>
                )}
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/erlang">
              <a className="nav-link mx-3 border-bottom">Erlang</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header

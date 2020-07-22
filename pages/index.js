import * as React from "react"
import fetch from "isomorphic-unfetch"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { parse } from "date-format-parse"

const localizer = momentLocalizer(moment)
function Model(props) {
  console.log({ props })
  const {
    data: { activity_periods = [] } = {},
    setIndexValue = () => {},
  } = props

  const [showCalender, setShowCalender] = React.useState(false)

  const onModelOuterClick = React.useCallback((e) => {
    console.log(e.target)
    if (e.target.getAttribute("wrapper") == "true") setIndexValue("")
  }, [])

  const renderActivePeriods = (item, index) => {
    const { start_time = "", end_time = "" } = item

    return (
      <div key={`activity-period-${index}`} className="ft-test-activity-block">
        <div className="ft-activity-range">
          {start_time} - {end_time}
        </div>
      </div>
    )
  }

  const timeParse = (value) => parse(value, "MMM D YYYY H:mmA")

  const events = activity_periods.map((item) => {
    const { start_time = "", end_time = "" } = item
    const startTime = timeParse(start_time)
    const endTime = timeParse(end_time)

    return {
      title: "User Activities",
      start: startTime,
      end: endTime,
    }
  })

  return (
    <div
      onClick={onModelOuterClick}
      wrapper={"true"}
      className="ft-modal-wrapper"
    >
      <div wrapper={"true"} className="ft-modal">
        <div className="ft-modal-block">
          <h2 className="ft-modal-title">User Activity Periods</h2>
          <div className="ft-modal-active-wrapper">
            {activity_periods.length > 0
              ? activity_periods.map(renderActivePeriods)
              : "No Active Lists"}
          </div>
          {!showCalender && (
            <button
              onClick={() => setShowCalender(true)}
              className="ft-test-view-all-btn"
            >
              View on Calender
            </button>
          )}
          {showCalender && (
            <div className="ft-test-calender-wrapper">
              <Calendar
                events={events}
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                defaultDate={
                  events.length > 0 ? events[0].start : moment().toDate()
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Index(props) {
  const { data: { members = [] } = {} } = props

  const [indexValue, setIndexValue] = React.useState("")

  const onNameClick = React.useCallback((e) => {
    setIndexValue(e.target.getAttribute("index"))
  }, [])

  const renderName = (item, index) => {
    const { real_name = "" } = item
    return (
      <div
        key={`list-name=${index}`}
        index={index}
        className="ft-test-name-element"
      >
        {real_name}
      </div>
    )
  }

  return (
    <div className="ft-test-wrapper">
      <div className="ft-test-title-block">
        <h1 className="ft-test-title">List of members</h1>
      </div>
      <div onClick={onNameClick} className="ft-test-names-block">
        {members.length > 0 ? members.map(renderName) : "No Results"}
      </div>
      {indexValue !== "" && (
        <Model setIndexValue={setIndexValue} data={members[indexValue]} />
      )}
    </div>
  )
}

Index.getInitialProps = async function (ctx) {
  const data = await (await fetch("http://localhost:3000/api/members")).json()
  return {
    data,
  }
}

export default Index

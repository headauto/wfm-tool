//AUX FUNCTIONS

export const convertDate = (dateStr) => {
  let newDate = new Date(dateStr + " 12:00:00")

  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0")
  }

  return [
    padTo2Digits(newDate.getMonth() + 1),
    padTo2Digits(newDate.getDate()),
    newDate.getFullYear(),
  ].join("/")
}

export const incrementDate = (dateStr) => {
  let newDate = new Date(dateStr + " 12:00:00")
  newDate.setDate(newDate.getDate() + 1)
  return newDate.toISOString().split("T")[0]
}

export const convertTime = (time) => {
  let timeAux = time.split(" ")
  timeAux[0] = timeAux[0].split(":").map((val) => parseInt(val))
  let out = 0
  if (timeAux[0][0] === 12) {
    timeAux[1] === "AM" ? (out = "0") : (out = "12")

    if (timeAux[0][1] >= 10) {
      out += timeAux[0][1]
    } else {
      out += "0" + timeAux[0][1]
    }
  } else {
    timeAux[1] === "AM"
      ? (out = timeAux[0][0] * 100 + timeAux[0][1])
      : (out = timeAux[0][0] * 100 + timeAux[0][1] + 1200)
    out = String(out)
  }

  if (out.length === 2) {
    out = "0" + out
  }
  return out
}

export const convertColonTime = (time) => {
  let timeAux = time.split(" ")
  timeAux[0] = timeAux[0].split(":").map((val) => parseInt(val))

  let out = 0
  if (timeAux[0][0] === 12) {
    timeAux[1] === "AM" ? (out = "00:") : (out = "12:")
  } else {
    timeAux[1] === "AM"
      ? (out = `${timeAux[0][0]}:`)
      : (out = `${timeAux[0][0] + 12}:`)
    if (out.length === 2) {
      out = "0" + out
    }
  }

  if (timeAux[0][1] >= 10) {
    out += timeAux[0][1]
  } else {
    out += "0" + timeAux[0][1]
  }

  if (out.length === 2) {
    out = "0" + out
  }
  return out
}

export const considerPM = (time, isFrom) => {
  let split = time.split(" ")
  if (/12:/.test(split[0])) {
    if (split[1] === "AM") {
      if (/12:00/.test(split[0])) {
        if (isFrom) {
          return 0
        } else {
          return 1440
        }
      } else {
        return getMinutes(split[0]) - 720
      }
    } else {
      return getMinutes(split[0])
    }
  } else {
    if (split[1] === "AM") {
      return getMinutes(split[0])
    } else {
      return getMinutes(split[0]) + 720
    }
  }
}

export const getHours = (time) => {
  let splitTime = time.split(":")
  return parseInt(splitTime[0]) + parseInt(splitTime[1]) / 60
}

export const getMinutes = (time) => {
  return getHours(time) * 60
}

export const getTime = (minutes) => {
  let d = new Date()
  d.setHours(0)
  d.setMinutes(minutes)
  let hh = d.getHours()
  let mm = d.getMinutes()
  if (mm < 10) {
    mm = "0" + mm
  }
  return hh + ":" + mm
}

function App() {

    const [displaytime, setDisplaytime] = React.useState(25 * 60)
    const [breaktime, setBreaktime] = React.useState(5 * 60)
    const [sessiontime, setSessiontime] = React.useState(25 * 60)
    const [timerON, setTimerON] = React.useState(false)
    const [onBreak, setOnbreak] = React.useState(false)
    const [breakaudio, setBreakaudio] = React.useState(new Audio("./beep.mp3"))

    const formatTime = (time) => {
        let min = Math.floor(time / 60)
        let sec = time % 60
        return (
            (min < 10 ? "0" + min : min) + ':' +
            (sec < 10 ? "0" + sec : sec))

    }

    const changeTime = (amount, type) => {
        if (type == "break") {
            if (breaktime <= 60 && amount < 0) {
                return;
            }
            setBreaktime((prev) => prev + amount)
        }
        else {
            if (sessiontime <= 60 && amount < 0) {
                return;
            }
            setSessiontime((prev) => prev + amount)

            if (!timerON) {
                setDisplaytime(sessiontime + amount)
            }
        }
    }

    const playbreakaudio = () => {
        breakaudio.currentTime = 0
        breakaudio.play();
    }

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        // console.log(date)
        let nextDate = new Date().getTime() + second;
        let onbreakvar = onBreak;

        if (!timerON) {
            let interval = setInterval(() => {

                date = new Date().getTime()
                if (date > nextDate) {

                    setDisplaytime((prev) => {
                        if (prev <= 0 && !onbreakvar) {
                            playbreakaudio()
                            onbreakvar = true
                            setOnbreak(true)
                            return breaktime
                        }
                        else if (prev <= 0 && onbreakvar) {
                            playbreakaudio()
                            onbreakvar = false
                            setOnbreak(false)
                            return sessiontime
                        }
                        return prev - 1;
                    });
                    nextDate += second
                }

            }, 1000)
            localStorage.clear()
            localStorage.setItem("interval-id", interval)
        }

        if (timerON) {
            clearInterval(localStorage.getItem("interval-id"))
        }

        setTimerON(prev => !prev)
    }
    const resetTime = () => {
        clearInterval(localStorage.getItem("interval-id")); // Clear the interval
    setDisplaytime(25 * 60);
    setBreaktime(5 * 60);
    setSessiontime(25 * 60);
    setTimerON(false); // Make sure the timer is turned off
    setOnbreak(false); // Reset the break state
    }

    return (
        <div className="center-align">
            <h1>25 + 5 Clock</h1>
            <div className="dual-container">
                <Length
                    title={"Break Length"}
                    changeTime={changeTime}
                    type={"break"}
                    time={breaktime}
                    titleID={"break-label"}
                    buttoninc={"break-increment"}
                    buttondec={"break-decrement"}
                    showtimetitle={"break-length"}
                />

                <Length
                    title={"Session Length"}
                    changeTime={changeTime}
                    type={"session"}
                    time={sessiontime}
                    titleID={"session-label"}
                    buttoninc={"session-increment"}
                    buttondec={"session-decrement"}
                    showtimetitle={"session-length"}
                />
            </div>
            <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
            <h1 id="time-left">{formatTime(displaytime)}</h1>
            <button id="start_stop" className="btn-large blue accent-3" onClick={controlTime} >
                {timerON ? (
                    <i className="material-icons">pause</i>
                ) :
                    <i className="material-icons">play_arrow</i>}
            </button>

            <button id="reset" className="btn-large blue accent-3" onClick={resetTime}>
                <i className="material-icons">restart_alt</i>
            </button>

        </div>
    )
}


function Length({ title, changeTime, type, time, titleID, buttoninc, buttondec, showtimetitle }) {
    return (
        <div>
            <h3 id={titleID}>{title}</h3>
            <div className="time-sets">
                <button id={buttoninc} className="btn-small blue accent-3" onClick={() => changeTime(-60, type)}>
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h3 id={showtimetitle}>{time / 60}</h3>
                <button id={buttondec} className="btn-small blue accent-3" onClick={() => changeTime(60, type)}>
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
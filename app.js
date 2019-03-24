const Form = props => {
    return (
        <form>
            <h1>Sprawdź pogodę</h1>
            <input
                type="text"
                placeholder="Wpisz miasto"
                onChange={props.change} />
        </form>
    )
}

const Result = props => {
    const { error, city, sunrise, sunset, temp, wind, pressure } = props.weather
console.log(pressure)
    let content = null

    if (!error && city) {
        const time = new Date().toLocaleString()
        const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString()
        const sunsetTime = new Date(sunset * 1000).toLocaleTimeString()
        content = (
            <div className="submenu">
                <h4><p>Pogoda dla miasta:</p> <em>{city.toUpperCase()}</em></h4>
                <h4><p>Dane dla dnia i godziny:</p> <em>{time}</em></h4>
                <h4><p>Wschód słońca dzisiaj:</p> <em>{sunriseTime}</em></h4>
                <h4><p>Zachód słońca dzisiaj:</p> <em>{sunsetTime}</em></h4>
                <h4><p>Temperatura:</p> <em>{temp} &#176;C</em></h4>
                <h4><p>Wiatr:</p> <em>{wind} m.s</em></h4>
                <h4><p>Ciśnienie:</p> <em>{pressure} hPa</em></h4>
            </div>
        )
    }

    return (
        <div className="error">
            {error ? `Nie ma w bazie ${city}` : content}
        </div>
    )
}


class App extends React.Component {
    state = {
        value: "",
        error: false,
        city: "",
        sunrise: "",
        sunset: "",
        temp: "",
        wind: "",
        pressure: "",
    }

    handleSubmitCity = e => {
        this.setState({
            value: e.target.value
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.value.length === 0) return
        console.log(prevState)
        if (prevState.value !== this.state.value) {
            const API = `https://api.openweathermap.org/data/2.5/weather?q=${this.state.value}&appid=165a8f5a8c2142a1416334c66c01324b&units=metric`
            fetch(API)
                .then(resp => {
                    if (resp.ok) {
                        return resp
                    }
                    throw Error("Nie udało się :(")
                })
                .then(resp => resp.json())
                .then(data => {
                    this.setState({
                        city: this.state.value,
                        error: false,
                        sunrise: data.sys.sunrise,
                        sunset: data.sys.sunset,
                        wind: data.wind.speed,
                        temp: data.main.temp,
                        pressure: data.main.pressure,
                    })
                })

                .catch(error => {
                    this.setState(prevState => ({
                        error: true,
                        city: prevState.value
                    }))
                })
        }
    }

    render() {
        return (
            <div className="wrapp">
                <Form
                    className="form"
                    value={this.state.value}
                    change={this.handleSubmitCity} />
                <Result
                    className="result"
                    weather={this.state} />
            </div>
        )
    }

}
ReactDOM.render(<App />, document.getElementById('root'))
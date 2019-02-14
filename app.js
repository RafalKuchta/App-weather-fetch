const Form = props => {
    return (
        <form>
            <input
                type="text"
                placeholder="Wpisz miasto"
                onChange={props.change} />
        </form>
    )
}

const Result = props => {
    const { error, city, sunrise, sunset, temp, wind, preassure } = props.weather

    let content = null

    if (!error && city) {
        const time = new Date().toLocaleString()
        const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString()
        const sunsetTime = new Date(sunset * 1000).toLocaleTimeString()
        content = (
            <div>
                <h4>Pogoda dla miasta: <em>{city}</em></h4>
                <h4>Dane dla dnia i godziny: <em>{time}</em></h4>
                <h4>Wschód słońca dzisiaj: <em>{sunriseTime}</em></h4>
                <h4>Zachód słońca dzisiaj: <em>{sunsetTime}</em></h4>
                <h4>Temperatura: <em>{temp} &#176;C</em></h4>
                <h4>Wiatr: <em>{wind} m.s</em></h4>
                <h4>Ciśnienie: <em>{preassure} hPa</em></h4>
            </div>
        )
    }

    return (
        <div>
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
        preassure: "",
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
                        preassure: data.main.preassure,
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
            <div>
                <Form
                    value={this.state.value}
                    change={this.handleSubmitCity} />
                <Result
                    weather={this.state} />
            </div>
        )
    }

}
ReactDOM.render(<App />, document.getElementById('root'))
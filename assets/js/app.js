'use stricts'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const search = $('.search')
const searchBtn = $('.search-btn')
const countrySelect = $('#country-select')

searchBtn.onclick = () => {
    weather.fetchCoordinates(search.value,countrySelect.value)
}

search.onkeyup = (e) => {
    switch (e.keyCode) {
        case 13:
            searchBtn.onclick()
            break;
        default:
            break;
    }
}



let weather = {
    apiKey: "f83bfdc6d789d2f9764194e6fbff568f",
    nameCity: '',
    nameCountry: '',
    fetchCoordinates: function (location, country) {
        fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${location},${country}&appid=${this.apiKey}`
        )
        .then(response => response.json())
        .then(data => {
            const { local_names, lat, lon } = data[0]
            const { vi } = local_names
            
            this.nameCity = vi
            this.nameCountry = country
            this.fetchWeather(lat,lon)
            // console.log(vi, lat, lon);
        })
        .catch(err => {
            alert(`Opps! Không tìm thấy địa điểm tên "${location}" bạn ơi :(`)
            console.log(err);
        })
    },
    fetchWeather: function (lat, lon) {
        fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&lang=vi&appid=${this.apiKey}`
        ).then((response) => response.json())
        .then((data) => {
            this.displayWeather(data)
        })  
    },
    displayWeather: function (data) {
        function timeConverter(UNIX_timestamp, flag =true){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = a.getMonth() + 1 //months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var dmy = `${date}/${month}/${year}` //date + '/' + month + ' ' + year; // + ' ' + hour + ':' + min + ':' + sec ;
            var hms = `${hour}:${min}:${sec}`
            
            if (flag) {
                return dmy
            } else {
                return hms
            }
        }
        
        // Current Weather
        const { dt, uvi, wind_speed, temp, feels_like, humidity, clouds } = data.current
        const { weather } = data.current
        const { id, icon, description } = weather[0]
        

        const rightPart = $('.right-part')
        
        console.log(id)

        let weatherCondition = ''
        if (id >= 200 && id <=232) {
            weatherCondition = 'thunderstorm'
        } else if ((id >= 300 && id <=321)) {
            weatherCondition = 'drizzle'
        } else if ((id >= 500 && id <=531)) {
            weatherCondition = 'rain'
        } else if ((id >= 600 && id <=622)) {
            weatherCondition = 'snow'
        } else if ((id >= 700 && id <=781)) {
            weatherCondition = 'atmosphere'
        } else if ((id == 800)) {
            weatherCondition = 'clear'
        } else if ((id >= 801 && id <=804)) {
            weatherCondition = 'clouds'
        }

        rightPart.classList = 'right-part ' + weatherCondition
        document.body.classList = weatherCondition
        
        const iconElement = $('.current-weather .icon')
        const dateElement =  $('.current-weather .text p')
        const tempElement = $('.current-weather .temp')
        const locationElement = $('.current-weather .location')
        const descElement = $('.current-weather .desc')
        const analysisElement = $('.analysis')

        

        
        iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">`
        dateElement.innerText = timeConverter(dt)
        tempElement.innerText = Math.round(temp) + '°C'
        locationElement.innerText = this.nameCity + ', ' + this.nameCountry
        descElement.innerText = description
        descElement.style.textTransform = 'capitalize'
        analysisElement.innerHTML = `
            <ul>
                <li><i class="fa-solid fa-droplet"></i> ${humidity}%</li>
                <li><i class="fa-solid fa-wind"></i> ${wind_speed} m/s</li>
                <li><i class="fa-solid fa-cloud"></i> ${clouds}%</li>
                <li><i class="fa-solid fa-temperature-high"></i> ${feels_like}</li>
            </ul>
        `
        // infoElement.innerText = `Feel like ${feels_like} - Sunset: ${timeConverter(sunset, false)}`
        
        // Daily Weather
        const daily = data.daily.slice(0,7)
        
        const table = $('tbody')
        table.innerHTML = `
            <tr>
                <th>Ngày</th>
                <th>Độ ẩm</th>
                <th>Thời tiết</th>
                <th>Sức gió</th>
                <th>Ngày</th>
                <th>Đêm</th>
            </tr>
        `
        daily.forEach((eachDay) => {
            const { dt, sunrise, sunset, temp, feels_like, humidity, clouds, weather, wind_speed } = eachDay
            const { day, night, min, max} = temp
            const { icon} = weather[0]
            

            const row = document.createElement('tr')
            row.innerHTML = `
                <th>${timeConverter(dt)}</th>
                <th><i class="fa-solid fa-droplet"></i> ${humidity}%</th>
                <th><img src="https://openweathermap.org/img/wn/${icon}.png" alt=""></th>
                <th><i class="fa-solid fa-wind"></i> ${wind_speed} m/s</th>
                <th><i class="fa-solid fa-temperature-half"></i> ${Math.round(day)}°C</th>
                <th><i class="fa-solid fa-temperature-half"></i> ${Math.round(night)}°C</th>
            `
            

            table.appendChild(row)

        })

    }

}

// weather.fetchWeather(33.44, -94.04)
weather.fetchCoordinates('Sài Gòn', 'VN')


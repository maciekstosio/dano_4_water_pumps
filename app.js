var app = new Vue({
    el: '#app',
    data: {
        details: [],        
    },
    methods: {
        update: function(data) {
            this.details = data.map(item => ({
                console: console.log(item),
                id: 69572,
                subvillage: "Mnyusi B",
                status: 2,
                status_text: "non functional",
                image: 'https://via.placeholder.com/700x300.png',
                reports: [{
                    id: 1,
                    text: "Consectetur sunt ut laborum irure eiusmod veniam aliqua fugiat."
                }]
            }))
        },
    }
})

const main = async () => {
    const unpack = (rows, key) => rows.map(row => row[key])
    const status_map = ["functional", "non functional", "functional needs repair"]
    const category_color = ["green", "red", "yellow"]
    const center = {
        longitude: 34.077427,
        latitude: -5.706033,
    }

    try {
        const stations = await d3.csv("data_for_vis.csv")

        console.log("stations", stations)

        var data = [
            {
                type: "scattermapbox",
                text: unpack(stations, "status_group").map(category => status_map[category]),
                lon: unpack(stations, "longitude"),
                lat: unpack(stations, "latitude"),
                marker: {
                    color: unpack(stations, "status_group").map(category => category_color[category]),
                    size: 5,
                    opacity: 0.5
                }
            },
        ];

        const layout = {
            dragmode: "zoom",
            mapbox: { style: "open-street-map", center: { lat: center.latitude, lon: center.longitude }, zoom: 6 },
            margin: { r: 0, t: 0, b: 0, l: 0 },
            autosize: true,
            showlegend: true,
        };


        const plot = await Plotly.newPlot("map", data, layout)

        plot.on('plotly_click', (data) => {
            console.log(data)
            app.update(data.points)
            $("#exampleModal").modal()
        })
    } catch (err) {
        console.log("error", err)
    }
}

main()
window.onresize = main
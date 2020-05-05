const unpack = (rows, key) => rows.map(row => row[key])
const randomInt = (min, max) => min + Math.floor((max - min) * Math.random())

const status_map = ["functional", "non functional", "need repair"]

const category_color = ["green", "red", "yellow"]

const center = {
    longitude: 34.077427,
    latitude: -5.706033,
}

var app = new Vue({
    el: '#app',
    data: {
        points: [],
        details: [],        
    },
    methods: {
        updatePoints: function(data) {
            this.points = data
        },
        update: function(data) {
            this.details = data.map(item => {
                const point = this.points.find(p => p.id === item.text)
                const {status_group, subvillage, id} = point

                return {
                    id,
                    subvillage,
                    status: status_group,
                    status_text: status_map[status_group],
                    image: faker.image.city(),
                    reports: new Array(randomInt(0, 4)).fill(null).map(_ => ({
                        id: faker.random.uuid(),
                        text: faker.lorem.paragraph()
                    })),
                }
            })
        },
    }
})

const main = async () => {
    try {
        const stations = await d3.csv("data_for_vis.csv")

        app.updatePoints(stations)

        stations0 = stations.filter(x => x.status_group == 0)

        var data0 = {
                type: "scattermapbox",
                text: unpack(stations0, "id"),
                lon: unpack(stations0, "longitude"),
                lat: unpack(stations0, "latitude"),
                marker: {
                    color: unpack(stations0, "status_group").map(category => category_color[category]),
                    size: 5,
                    opacity: 0.5
                },
                name: "Functional"
            }

        stations1 = stations.filter(x => x.status_group == 1)

        var data1 = {
                type: "scattermapbox",
                text: unpack(stations1, "id"),
                lon: unpack(stations1, "longitude"),
                lat: unpack(stations1, "latitude"),
                marker: {
                    color: unpack(stations1, "status_group").map(category => category_color[category]),
                    size: 5,
                    opacity: 0.5
                },
                name: "Non functional"
            }

        stations2 = stations.filter(x => x.status_group == 2)

        var data2 = {
                type: "scattermapbox",
                text: unpack(stations2, "id"),
                lon: unpack(stations2, "longitude"),
                lat: unpack(stations2, "latitude"),
                marker: {
                    color: unpack(stations2, "status_group").map(category => category_color[category]),
                    size: 5,
                    opacity: 0.5
                },
                name: "Need repair"
            }
        

        var data = [data2, data1, data0];

        /*var data = [
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
        ];*/

        

        const layout = {
            dragmode: "zoom",
            mapbox: { style: "open-street-map", center: { lat: center.latitude, lon: center.longitude }, zoom: 6 },
            margin: { r: 0, t: 0, b: 0, l: 0 },
            autosize: true,
            showlegend: true,
            legend: {
                x: 0.03,
                xanchor: 'left',
                y: 0.95
            }
        };

        const plot = await Plotly.newPlot("map", data, layout)

        plot.on('plotly_click', (data) => {
            console.log("CLICK", data)
            app.update(data.points)
            $("#exampleModal").modal()
        })
    } catch (err) {
        console.log("error", err)
    }
}

main()
window.onresize = main
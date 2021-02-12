import {Page} from './page';
import {RadioGroup} from "../components/radio-group";
import {Card} from "../components/card";
import {colorsForStack} from "../shared/colors";

/**
 *
 * @class ArtistsDataPage
 * @extends Page
 */
export class ArtistsDataPage extends Page {

    /**
     *
     * @param application
     */
    constructor(application) {
        super(application, 'Artists Metadata');


        this.buildSubpage();
        this.createCard();
        this.createContentTypeRadioGroup();
        this.valueGettingFunction = this.numberOfTypes;

        this.initialize();
        this.renderSVG();
        this.renderTooltip();

        this.loadCorpusIfNeeded();
    }

    initialize() {
        this.width = 1000;
        this.margin = {top: 20, right: 70, bottom: 50, left: 180};
        this.graphWidth = this.width - this.margin.left - this.margin.right;
        this.lineHeight = 18;
    }

    renderSVG() {
        this.chartView = this.card.content;
        this.svg = this.chartView
            .append("svg");
        this.graph = this.svg
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    renderTooltip() {
        this.tooltip = this.card.content
            .append("div")
            .attr("class", "tooltip map-tooltip")
            .style("position", "absolute")
            .style("border", "1px solid #69b3a2")
            .style("display", "none");
    }

    buildVisual(data) {
        const margin = this.margin;
        const max = d3.max(data, (item) => item.value);
        const colorString = colorsForStack(0, 1)[0].rgbString();

        this.graphHeight = (this.lineHeight * data.length);
        this.height = this.graphHeight + (margin.top + margin.bottom);

        this.graph.selectAll('g').remove();
        this.graph.selectAll('text').remove();
        this.graph.selectAll('rect').remove();

        this.svg.attr('viewBox', `0 0 ${this.width} ${this.height}`);

        const x = d3.scaleLinear()
            .domain([0, max])
            .range([0, this.graphWidth]);

        const y = d3.scaleBand()
            .range([0, this.graphHeight])
            .domain(data.map((item) => `${item.name} (${item.geniusId})`))
            .padding(.1);

        this.graph
            .append("g")
            .attr("transform", "translate(0," + this.graphHeight + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        this.graph
            .append("g")
            .call(d3.axisLeft(y));

        const barGroup = this.graph
            .selectAll("chart-rect")
            .data(data)
            .enter()
            .append("rect")
            .classed("chart-rect", true);

        barGroup
            .attr("x", x(0))
            .attr("y", (item) => y(`${item.name} (${item.geniusId})`))
            .attr("width", (item) => x(item.value))
            .attr("height", y.bandwidth())
            .attr("fill", colorString)
            .attr("rx", "4")
            .attr("ry", this.lineHeight / 2);

        barGroup
            .on("mousemove", function (event, item) {

                this.tooltip
                    .style("display", "inline-block")
                    .html('Value: ' + (item.value) + "<br>Artist: " + item.name);

                let tooltipWidth = this.tooltip.style('width').replace('px', '');

                let element = document.getElementById('content');
                let offset = element.getBoundingClientRect();

                let width = this.chartView.style('width').replace('px', '');
                let ratio = width / 1000;
                console.log('ratio: ' + ratio);

                let xPos = x(item.value) / 2;
                xPos += offset.x;
                xPos *= ratio;
                xPos += margin.left;
                xPos += window.scrollX;
                xPos -= tooltipWidth / 2;

                let yPos = y(`${item.name} (${item.geniusId})`);
                yPos += margin.top;
                yPos *= ratio;
                yPos += offset.y;
                yPos += this.lineHeight;
                yPos += window.scrollY;

                this.tooltip
                    .style("left", xPos + "px")
                    .style("top", yPos + "px")
                    .style("position", "absolute")
                    .style("border", "1px solid #69b3a2")
                    .style("display", "inline-block")
                    .html('Value: ' + (item.value) + "<br>Artist: " + item.name);
            }.bind(this))
            .on("mouseout", function (d) {
                this.tooltip.style("display", "none");
            }.bind(this));

        this.graph
            .selectAll(".text")
            .data(data)
            .enter()
            .append('text')
            .text((item) => item.value)
            .attr("x", (item) => x(item.value))
            .attr("y", (item) => y(`${item.name} (${item.geniusId})`))
            .attr('dy', this.lineHeight - 6)
            .attr('dx', '6')
            .attr("width", (item) => x(item.value))
            .attr("height", y.bandwidth())
            .attr("font-size", 13)
            .attr('fill', 'gray');

    }

    /**
     *
     */
    willLoadCorpus() {
        super.willLoadCorpus();
        this.loadingView = this.addLoadingView(this.card.body);
    }

    /**
     *
     */
    didLoadCorpus() {
        super.didLoadCorpus();
        this.update();
        this.loadingView.remove();
    }

    /**
     *
     */
    createCard() {
        this.cardContainer = this.addContainer(this.row, 'col-12');
        this.card = new Card(this.cardContainer);
    }

    /**
     *
     */
    createContentTypeRadioGroup() {

        this.card.headerCenterComponent
            .classed('text-center', true)
            .append('div')
            .attr('id', 'radio-group-2');

        this.radioGroup = new RadioGroup(this.card.headerCenterComponent);
        this.radioGroup.setOptions([
            ['types', 'Types'],
            ['words', 'Words'],
            ['tracks', 'Tracks'],
            ['albums', 'Albums']
        ]);

        this.radioGroup.onChange = function (value) {
            this.chartTypeAction(value);
        }.bind(this);
    }

    chartTypeAction(value) {
        console.log("value: " + value);
        switch (value) {
            case 'types':
                this.valueGettingFunction = this.numberOfTypes;
                break;
            case 'words':
                this.valueGettingFunction = this.numberOfWords;
                break;
            case 'tracks':
                this.valueGettingFunction = this.numberOfTracks;
                break;
            case 'albums':
                this.valueGettingFunction = this.numberOfAlbums;
                break;
            default:
                console.log("unknown chart type: " + value);
                break;
        }
        this.update();
    }

    numberOfTypes(artist) {
        return (new Set(artist.allWords())).size;
    }

    numberOfWords(artist) {
        return artist.allWords().length;
    }

    numberOfTracks(artist) {
        return artist.allTracks().length;
    }

    numberOfAlbums(artist) {
        return artist.albums.length;
    }

    update() {
        let corpus = this.application.corpus;
        if (!corpus) return;

        const root2 = d3.hierarchy(corpus.artists);
        const artists = corpus.artists
            .filter((artists) => artists.allTracks().length > 0)
            .reverse();

        let data = [];
        for (let i = 0; i < artists.length; i++) {
            let artist = artists[i];
            let artistName = artist.name;
            let value = this.valueGettingFunction(artist);
            data.push({
                name: artistName,
                geniusId: artist.geniusId,
                departement: artist.departement,
                departementNo: artist.departementNo,
                value: Number(value)
            });
        }

        data = d3.sort(data, function (a, b) {
            return b.value - a.value;
        });

        const countAll = data.length;
        data = data.filter((item) => item.value > 0);

        const countFiltered = data.length;
        console.log("countAll: " + countAll);
        console.log("countFiltered: " + countFiltered);
        this.buildVisual(data);

    }

    buildHistogram(data) {
        // const max = d3.max(data, (item: any) => item.value);
        // const height = 500;
        // const width = 1000;
        // const margin = {top: 50, right: 50, bottom: 50, left: 50};
        //
        // const histogramView = d3.select(".histogram");
        // histogramView.selectAll('svg').remove();
        //
        // const svg = histogramView
        //     .append("svg")
        //     .attr("width", width)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //
        // const x = d3.scaleLinear()
        //     .domain([0, max])
        //     .range([0, width]);
        //
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));
        //
        // const histogram = d3.histogram()
        //     .value((item: any) => item.value)
        //     .domain(this.x.domain())
        //     .thresholds(x.ticks(50));
        //
        // const bins = histogram(data);
        //
        // const y = d3.scaleLinear()
        //     .range([height, 0]);
        //
        // y.domain([0, d3.max(bins, function (d) {
        //     // @ts-ignore
        //     return d.length;
        // })]);   // d3.hist has to be called before the Y axis obviously
        //
        // svg.append("g")
        //     .call(d3.axisLeft(y));
        //
        // svg.selectAll("myRect")
        //     .data(bins)
        //     .enter()
        //     .append("rect")
        //     .attr("x", 1)
        //     .attr("transform", function (d: any) {
        //         return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        //     })
        //     .attr("width", (d: any) => Math.max(0, x(d.x1) - x(d.x0) - 1))
        //     .attr("height", function (d: any) {
        //         return height - y(d.length);
        //     })
        //     .style("fill", "#69b3a2");
    }
}

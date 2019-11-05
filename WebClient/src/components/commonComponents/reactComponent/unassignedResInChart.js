'use strict';

const e = React.createElement;
const Grid = ReactVirtualized.Grid,
    defaultCellRangeRenderer = ReactVirtualized.defaultCellRangeRenderer,
    ScrollSync = ReactVirtualized.ScrollSync,
    List = ReactVirtualized.List,
    InfiniteLoader = ReactVirtualized.InfiniteLoader;


import moment from "moment";

let data = null, dateHeaders = null, events = null, units = null, properties = null, showResGrid = true;

class ReactGrid extends React.Component {
    constructor(props) {
        super(props);
        this.headerRenderer = this.headerRenderer.bind(this);
        this.cellRenderer = this.cellRenderer.bind(this);
        this.onScrollHeaderGrid = this.onScrollHeaderGrid.bind(this);
        this.onScrollGrid = this.onScrollGrid.bind(this);
        this.cellRangeRenderer = this.cellRangeRenderer.bind(this);
        this.unitPropertyNamesRenderer = this.unitPropertyNamesRenderer.bind(this);
        this.unitPropertyHeaderRenderer = this.unitPropertyHeaderRenderer.bind(this);
        this.onScrollUnitPropertyGrid = this.onScrollUnitPropertyGrid.bind(this);
        this.loadMoreRows = this.loadMoreRows.bind(this);
        this.isRowLoaded = this.isRowLoaded.bind(this);
        this.getFormatedDateHeader = this.getFormatedDateHeader.bind(this);
        this.toggleUnitsNumberAndPercentage = this.toggleUnitsNumberAndPercentage.bind(this);

        this.state = {
            data: data,
            headers: dateHeaders,
            events: events,
            units: units,
            properties: properties,
            resHeaders: ['StartDate', 'ConfirmationNumber', 'GuestName', 'Reservationstatus'],
            listData: [1, 2.3, 4, 5, 6, 7],
            gridProps: {
                clientHeight: 100,
                clientWidth: 100,
                scrollHeight: 100,
                scrollLeft: null,
                scrollTop: null,
                scrollWidth: 100
            },
            verticalGridProps: {
                clientHeight: 100,
                clientWidth: 100,
                scrollHeight: 100,
                scrollLeft: null,
                scrollTop: null,
                scrollWidth: 100
            },
            unitPropertyList: [
                {
                    UnitName: "Unit1",
                    PropertyName: "PR1",
                    UnitTypeName: "UT1"
                },
                {
                    UnitName: "Unit2",
                    PropertyName: "PR1",
                    UnitTypeName: "UT4"
                },
                {
                    UnitName: "Unit3",
                    PropertyName: "PR2",
                    UnitTypeName: "UT5"
                },
                {
                    UnitName: "Unit4",
                    PropertyName: "PR1",
                    UnitTypeName: "UT1"
                },
                {
                    UnitName: "Unit5",
                    PropertyName: "PR3",
                    UnitTypeName: "UT7"
                }
            ],
            unitPropertyColumns: [
                "PropertyName",
                "UnitNickName",
                "UnitTypeName"
            ],
            unitPropertyColumnsLabel: [
                "Property",
                "Unit",
                "Unit Type"
            ],
            unitPropertyColumnToolTip: [
                "PropertyName",
                "UnitName",
                "UnitTypeName"
            ],
            dateHeadersStyle: {
                width: window.innerWidth - 560
            },
            showUnitCount: true,
            showResGrid: showResGrid
        };
    }

    componentDidUpdate(prevProps) {
        //console.log(prevProps);
    }

    getColumnValue(rowIndex, columnIndex, key) {
        console.log(this.state.data[rowIndex]);
        //return this.state.data[rowIndex]["Reservationstatus"];        
        if (this.state.data[rowIndex]["unitReservations"][columnIndex]["ReservationId"] === -1)
            return this.state.data[rowIndex]["unitReservations"][columnIndex]["ReservationStatus"];
        else
            return this.state.data[rowIndex]["unitReservations"][columnIndex]["GuestName"];
    }

    getFormatedDateHeader(columnIndex, key, rowIndex, style) {
        return (<div><span>{moment(this.state.headers[columnIndex]).format('DD MMM')}</span><span>{moment(this.state.headers[columnIndex]).format('ddd')}</span></div>);
    }

    headerRenderer({ columnIndex, key, rowIndex, style }) {
        //console.log(this.state);
        return (
            <div key={key} style={style} className='tapechartDate'>
                {/* {this.getFormatedDateHeader(columnIndex, key, rowIndex, style)} */}
                <span className='tapechartMonth'></span>
                <span className='tapechartDateNum'>{moment(this.state.headers[columnIndex]).format('DD')}</span><span className='tapechartDay'>{moment(this.state.headers[columnIndex]).format('ddd' + ' , ' + 'MMM')}</span>
            </div>
        )
    }

    unitPropertyNamesRenderer({ columnIndex, key, rowIndex, style }) {

        let currUnit = this.state.units[rowIndex];
        //let currUnit = resObj ? resObj[0] : null;
        //console.log(currUnit);
        if (currUnit && this.state.unitPropertyColumns[columnIndex] == "UnitTypeName")
            return (
                <div key={key} style={style} title={currUnit[this.state.unitPropertyColumnToolTip[columnIndex]]}>
                    <span className={'nameOverflow unitType ' + currUnit["UnitTypeColorCode"]}> {currUnit.UnitTypeName} </span>
                </div>
            )

        else if (currUnit && this.state.unitPropertyColumns[columnIndex] == "PropertyName") {

            return (
                <div key={key} style={style} title={currUnit[this.state.unitPropertyColumnToolTip[columnIndex]]}>
                    <span className={'nameOverflow'}> {currUnit[this.state.unitPropertyColumns[columnIndex]]} </span>
                </div>
            )

        }
        else if (currUnit && this.state.unitPropertyColumns[columnIndex] == "UnitNickName") {

            return (
                <div key={key} style={style} title={currUnit[this.state.unitPropertyColumnToolTip[columnIndex]]}>
                    {currUnit.IsAssigned ? <span className={'nameOverflow'}> {currUnit[this.state.unitPropertyColumns[columnIndex]]} </span>
                        : <span className={'nameOverflow'}> {""} </span>}
                </div>
            )

        }
        // else if (this.state.unitPropertyColumns[columnIndex] == "PropertyName" && !this.state.units[rowIndex][this.state.unitPropertyColumns[columnIndex]]) {

        //     console.log(style);

        //     let tempStyle = JSON.parse(JSON.stringify(style));
        //     tempStyle.width = tempStyle.width * 3;

        //     return (
        //         <div key={key} style={tempStyle} className="availHeader">
        //             {/* <button className={this.state.showUnitCount ? 'has': 'perc'} onClick={this.toggleUnitsNumberAndPercentage}>#</button>
        //             <button onClick={this.toggleUnitsNumberAndPercentage}>%</button> */}
        //             <div className={"radioToggle"}>
        //                 <label><input type="radio" name={"occToggle"} disabled={this.state.showUnitCount} checked={this.state.showUnitCount} value="#" onClick={this.toggleUnitsNumberAndPercentage} /><span>Available Units</span></label>
        //                 <label><input type="radio" name={"occToggle"} disabled={!this.state.showUnitCount} checked={!this.state.showUnitCount} value="%" onClick={this.toggleUnitsNumberAndPercentage} /><span>Occupancy %</span></label>
        //             </div>
        //         </div>
        //     )
        // }
        // else if ((this.state.unitPropertyColumns[columnIndex] == "UnitNickName" || this.state.unitPropertyColumns[columnIndex] == "UnitTypeName") && !this.state.units[rowIndex][this.state.unitPropertyColumns[columnIndex]]) {
        //     return (
        //         <div>

        //         </div>);
        // }
        else
            return (
                <div key={key} style={style} className='nameOverflow noname'>
                    {""}
                </div>
            )
    }

    unitPropertyHeaderRenderer({ columnIndex, key, rowIndex, style }) {
        return (
            <div key={key} style={style}>
                {this.state.unitPropertyColumnsLabel[columnIndex]}
            </div>
        )
    }

    cellRenderer({ columnIndex, key, rowIndex, style }) {

        return (
            <div key={key} style={style}>
                {this.getColumnValue(rowIndex, columnIndex, key)}
            </div>
        )
    }

    cellRangeRenderer({
        parent,
        cellCache,                    // Temporary cell cache used while scrolling
        cellRenderer,                 // Cell renderer prop supplied to Grid
        columnSizeAndPositionManager, // @see CellSizeAndPositionManager,
        columnStartIndex,             // Index of first column (inclusive) to render
        columnStopIndex,              // Index of last column (inclusive) to render
        horizontalOffsetAdjustment,   // Horizontal pixel offset (required for scaling)
        isScrolling,                  // The Grid is currently being scrolled
        rowSizeAndPositionManager,    // @see CellSizeAndPositionManager,
        rowStartIndex,                // Index of first row (inclusive) to render
        rowStopIndex,                 // Index of last row (inclusive) to render
        scrollLeft,                   // Current horizontal scroll offset of Grid
        scrollTop,                    // Current vertical scroll offset of Grid
        styleCache,                   // Temporary style (size & position) cache used while scrolling
        verticalOffsetAdjustment      // Vertical pixel offset (required for scaling)
    }) {
        const renderedCells = []

        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            // This contains :offset (top) and :size (height) information for the cell
            let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex), renderedResObj = {}

            for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex;) {
                // This contains :offset (left) and :size (width) information for the cell
                let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)
                // Be sure to adjust cell position in case the total set of cells is too large to be supported by the browser natively.
                // In this case, Grid will shift cells as a user scrolls to increase cell density.
                let left = columnDatum.offset + horizontalOffsetAdjustment
                let top = rowDatum.offset + verticalOffsetAdjustment

                // The rest of the information you need to render the cell are contained in the data.
                // Be sure to provide unique :key attributes.
                let key = `${rowIndex}-${columnIndex}`
                let height = rowDatum.size
                let width = columnDatum.size
                let style = {
                    height: height,
                    left: left,
                    position: "absolute",
                    top: top,
                    width: width
                };
                // Now render your cell and additional UI as you see fit.
                // Add all rendered children to the :renderedCells Array.

                let currReservations = this.state.data[rowIndex]["unitReservations"];

                if (currReservations.length > 0) {

                    let currResObj = currReservations[columnIndex], headerArr = this.state.headers;

                    let resObj = currReservations.filter(function (rObj) {
                        return rObj.ReservationId > 0 &&
                            moment.utc(headerArr[columnIndex]).format("YYYY-MM-DD") >= moment.utc(rObj.StartDate).format("YYYY-MM-DD")
                            && moment.utc(headerArr[columnIndex]).format("YYYY-MM-DD") < moment.utc(rObj.EndDate).format("YYYY-MM-DD");
                    });

                    currResObj = resObj ? resObj[0] : currResObj;

                    if (currResObj) {
                        //Currency should be get from Client/Property set up                    
                        var dayClass = "Cell" + moment.utc(this.state.headers[columnIndex]).format('ddd');
                        if (currResObj["ReservationId"] === -1 && currResObj["IsOccupancy"]) {
                            renderedCells.push(<div key={key} style={style} className={'resAvailable ' + dayClass + ' availHeader'}>
                                {parent.props.showUnitCount ? currResObj["AvailUnitsCount"] : currResObj["AvailUnitsPercent"]}
                            </div>
                            );
                            columnIndex++;
                        }
                        else if (currResObj["ReservationId"] === -1 || !parent.props.showResGrid) {
                            renderedCells.push(<div key={key} style={style}>
                                {''}
                                {/* {currReservations[columnIndex]["Amount"] ? '$ ' + currReservations[columnIndex]["Amount"] : ''} */}
                            </div>
                            );
                            columnIndex++;
                        }
                        else {
                            if (!renderedResObj.hasOwnProperty(currResObj.ReservationId)) {
                                renderedResObj[currResObj.ReservationId] = {};

                                style.cursor = "pointer";

                                let noOfNights = moment.utc(currResObj["EndDate"]).diff(moment.utc(currResObj["StartDate"]), "days");

                                if (moment.utc(headerArr[columnIndex]).format("YYYY-MM-DD") != moment.utc(currResObj.StartDate).format("YYYY-MM-DD"))
                                    noOfNights = noOfNights - (moment.utc(headerArr[columnIndex]).diff(moment.utc(currResObj["StartDate"]), "days"))

                                style.width = style.width * (noOfNights ? noOfNights : 1);

                                let className = currResObj["ReservationStatus"] + (currResObj["SourceName"] ? ' ' + currResObj["SourceName"] : '') + ' ' + (currResObj["IsAssigned"] ? 'assigned' : 'unassigned');

                                renderedCells.push(<div key={key} style={style} onClick={this.navigateToReservations.bind(this, currResObj)}>
                                    <span className={'statusType nameOverflow ' + className} title={currResObj["GuestName"]}>
                                        {currResObj["GuestName"]}
                                    </span>
                                </div>
                                );

                                columnIndex = columnIndex + (noOfNights ? noOfNights : 1);
                            }
                            else {
                                renderedCells.push(<div key={key} style={style}>
                                    {''}
                                    {/* {currReservations[columnIndex]["Amount"] ? '$ ' + currReservations[columnIndex]["Amount"] : ''} */}
                                </div>
                                );
                                columnIndex++
                            }
                        }
                    }
                    else {
                        renderedCells.push(<div key={key} style={style}>
                            {''}
                            {/* {currReservations[columnIndex]["Amount"] ? '$ ' + currReservations[columnIndex]["Amount"] : ''} */}
                        </div>
                        );
                        columnIndex++;
                    }
                }
                else {
                    columnIndex++;
                    console.log("no reservations found");
                }
            }
        }

        return renderedCells
    }

    onSectionRendered() {
        //console.log("Section rendered");
    }

    onScrollGrid(props) {
        //console.log(props);
        this.setState({
            gridProps: {
                clientHeight: props.clientHeight,
                clientWidth: props.clientWidth,
                scrollHeight: props.scrollHeight,
                scrollLeft: props.scrollLeft,
                scrollTop: props.scrollTop,
                scrollWidth: props.scrollWidth
            }
        });

        this.setState({
            verticalGridProps: {
                clientHeight: props.clientHeight,
                clientWidth: props.clientWidth,
                scrollHeight: props.scrollHeight,
                scrollLeft: null,
                scrollTop: props.scrollTop,
                scrollWidth: props.scrollWidth
            }
        });
    }

    onScrollUnitPropertyGrid(props) {
        //console.log("UnitPropertyGrid Scrolled");
        this.setState({
            verticalGridProps: {
                clientHeight: props.clientHeight,
                clientWidth: props.clientWidth,
                scrollHeight: props.scrollHeight,
                scrollLeft: null,
                scrollTop: props.scrollTop,
                scrollWidth: props.scrollWidth
            }
        });
    }

    onScrollHeaderGrid(props) {
        //console.log(props);
        this.setState({
            gridProps: {
                clientHeight: props.clientHeight,
                clientWidth: props.clientWidth,
                scrollHeight: props.scrollHeight,
                scrollLeft: props.scrollLeft,
                scrollTop: props.scrollTop,
                scrollWidth: props.scrollWidth
            }
        });
    }

    scrollTopList() {

    }

    navigateToReservations(resObj) {
        console.log(resObj);
        this.state.events.navigateToReservation(resObj);
    }

    rowRenderer({
        key,         // Unique key within array of rows
        index,       // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible,   // This row is visible within the List (eg it is not an overscanned row)
        style        // Style object to be applied to row (to position it)
    }) {
        return (
            <div
                key={key}
                style={style}
            >
                {dateHeaders[index]}
            </div>
        )
    }

    loadMoreRows({ startIndex, stopIndex }) {
        console.log("load more rows => ", startIndex, stopIndex);
    }

    isRowLoaded({ index }) {
        console.log("isRowLoaded => ", !!this.state.data[index]);
        return !!this.state.data[index];
    }

    toggleUnitsNumberAndPercentage() {
        console.log("clicked here ");
        // this.setState({
        //     showUnitCount: !this.state.showUnitCount
        //   })
        //this.state.events.toggleButton(this.state.showUnitCount);
        this.setState((state, prevProps) => {
            // Important: read `state` instead of `this.state` when updating.            
            return { showUnitCount: !state.showUnitCount }
        });

        console.log(this.state.showUnitCount)
    }

    render() {
        return <ScrollSync>
            {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
                <div className='RatesGrid'>
                    <div className='Table'>
                        <div className='LeftColumn unitsList'>
                            <Grid
                                cellRenderer={this.unitPropertyHeaderRenderer}
                                columnCount={3}
                                columnWidth={100}
                                height={50}
                                rowCount={1}
                                rowHeight={50}
                                width={320}
                            // {...this.state.gridProps}
                            />
                        </div>
                        <div className='unitsList RightColumn'>
                            <Grid
                                cellRenderer={this.unitPropertyNamesRenderer}
                                columnCount={3}
                                columnWidth={100}
                                height={window.innerHeight - 370}
                                rowCount={1}
                                rowHeight={40 * this.state.data.length}
                                width={320}
                                onScroll={this.onScrollUnitPropertyGrid}
                                {...this.state.verticalGridProps}
                                showUnitCount={this.state.showUnitCount}
                            />
                        </div>
                    </div>
                    <div className='Table'>
                        <div className='LeftColumn' style={this.state.dateHeadersStyle}>
                            <Grid
                                cellRenderer={this.headerRenderer}
                                columnCount={this.state.headers.length}
                                columnWidth={70}
                                height={50}
                                rowCount={1}
                                rowHeight={50}
                                width={window.innerWidth - 580}
                                // onScroll={this.onScrollHeaderGrid}
                                {...this.state.gridProps}
                            />
                        </div>
                        <div className='RightColumn'>
                            <Grid
                                cellRenderer={this.cellRenderer}
                                onSectionRendered={this.onSectionRendered}
                                columnCount={this.state.headers.length}
                                columnWidth={70}
                                height={window.innerHeight - 370}
                                rowCount={this.state.data.length}
                                rowHeight={40}
                                width={window.innerWidth - 560}
                                onScroll={this.onScrollGrid}
                                cellRangeRenderer={this.cellRangeRenderer}
                                {...this.state.gridProps}
                                showUnitCount={this.state.showUnitCount}
                                showResGrid={this.state.showResGrid}
                            />

                        </div>
                    </div>
                </div>
            )}
        </ScrollSync>
    }
}

export default function unassigneResGrid(el) {

    this.init = (tapeChartProps) => {
        ReactDOM.unmountComponentAtNode(el);

        data = tapeChartProps._data;
        dateHeaders = tapeChartProps._dateHeaders;
        events = tapeChartProps._events;
        properties = tapeChartProps._properties;
        units = tapeChartProps._units;

        ReactDOM.render(<ReactGrid />, el);

    }

    this.destroy = (el) => {
        ReactDOM.unmountComponentAtNode(el);
    }

    this.applyData = (data) => {

    };

    this.update = (tapeChartProps) => {
        ReactDOM.unmountComponentAtNode(el);

        if (tapeChartProps._data) {
            data = tapeChartProps._data;
            dateHeaders = tapeChartProps._dateHeaders;
            events = tapeChartProps._events;
            properties = tapeChartProps._properties;
            units = tapeChartProps._units;
        }

        showResGrid = tapeChartProps.showResGrid;

        ReactDOM.render(<ReactGrid />, el);
    }
}
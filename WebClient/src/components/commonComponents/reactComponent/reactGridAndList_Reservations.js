'use strict';

const e = React.createElement;
const Grid = ReactVirtualized.Grid,
    defaultCellRangeRenderer = ReactVirtualized.defaultCellRangeRenderer,
    ScrollSync = ReactVirtualized.ScrollSync,
    List = ReactVirtualized.List,
    InfiniteLoader = ReactVirtualized.InfiniteLoader;

import moment from "moment";

let data = null, dateHeaders = null, events = null, units = null, properties = null, showResGrid = true, clientWeekends = null, filterObj = null,
    originalData = null, originalUnits = null;

class ReactGrid extends React.Component {
    constructor(props) {
        super(props);
        this.headerRenderer = this.headerRenderer.bind(this);
        this.cellRenderer = this.cellRenderer.bind(this);
        this.onScrollHeaderGrid = this.onScrollHeaderGrid.bind(this);
        this.onScrollGrid = this.onScrollGrid.bind(this);
        this.cellRangeRenderer = this.cellRangeRenderer.bind(this);
        this.headerCellRangeRenderer = this.headerCellRangeRenderer.bind(this);
        this.unitPropertyNamesRenderer = this.unitPropertyNamesRenderer.bind(this);
        this.unitPropertyNamesCellRangeRenderer = this.unitPropertyNamesCellRangeRenderer.bind(this);
        this.unitPropertyHeaderRenderer = this.unitPropertyHeaderRenderer.bind(this);
        this.onScrollUnitPropertyGrid = this.onScrollUnitPropertyGrid.bind(this);
        this.loadMoreRows = this.loadMoreRows.bind(this);
        this.isRowLoaded = this.isRowLoaded.bind(this);
        this.getFormatedDateHeader = this.getFormatedDateHeader.bind(this);
        this.toggleUnitsNumberAndPercentage = this.toggleUnitsNumberAndPercentage.bind(this);
        this.navigateToReservations = this.navigateToReservations.bind(this);
        this.showUnassignedRes = this.showUnassignedRes.bind(this);

        this.state = {
            data: data,
            originalData: originalData,
            headers: dateHeaders,
            events: events,
            units: units,
            originalUnits: originalUnits,
            properties: properties,
            filterObj: filterObj,
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
                "Property Nickname",
                "Unit Nickname",
                "Unit Type"
            ],
            unitPropertyColumnToolTip: [
                "PropertyName",
                "UnitName",
                "UnitTypeName"
            ],
            dateHeadersStyle: {
                width: window.innerWidth - 580
                // width: dateHeaders[0].length * 70 > window.innerWidth - 580 ? window.innerWidth - 580 : dateHeaders[0].length *70
            },
            showUnitCount: '$',
            showResGrid: showResGrid,
            showUnassigned: false,
            selectedUnitId: null
        };
    }

    componentDidUpdate(prevProps) {
        console.log(prevProps);
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

    headerCellRangeRenderer({
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
            let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

            for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
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

                let dayClass = "tapechartDate"
                if (this.state.headers[rowIndex][columnIndex]["date"] === moment().format("YYYY-MM-DD")) {
                    dayClass += " today";
                }

                // if (this.state.headers[rowIndex][columnIndex]["date"] === moment.utc().add(-1, 'days').format("YYYY-MM-DD")) {
                //     dayClass += " yesterday";
                // }

                if (rowIndex == 1 && this.state.headers[rowIndex][columnIndex]["IsOccupancy"]) {
                    renderedCells.push(
                        <div key={key} style={style} className={'resAvailable ' + dayClass + ' availHeader'}>
                            {parent.props.showUnitCount == '$' ? this.state.headers[rowIndex][columnIndex]["SoldUnitsCount"] :
                                (parent.props.showUnitCount == '#' ? <span><span className={"numerator"}>{this.state.headers[rowIndex][columnIndex]["AvailUnits"] + "/"}</span><span className={"denominator"}>{this.state.headers[rowIndex][columnIndex]["TotalUnits"]}</span></span>
                                    : this.state.headers[rowIndex][columnIndex]["AvailUnitsPercent"])}
                        </div>
                    );
                }
                else {
                    renderedCells.push(
                        <div key={key} style={style} className={dayClass}>
                            <span className='tapechartMonth'></span>
                            <span className='tapechartDateNum'>{moment(this.state.headers[rowIndex][columnIndex]["date"]).format('DD')}</span><span className='tapechartDay'>{moment(this.state.headers[rowIndex][columnIndex]["date"]).format('ddd' + ' , ' + 'MMM')}</span>
                        </div>
                    )
                }
            }
        }

        return renderedCells;

    }

    unitPropertyNamesRenderer({ columnIndex, key, rowIndex, style }) {
        let currUnitDetails = this.state.units[rowIndex];

        if (this.state.unitPropertyColumns[columnIndex] == "UnitTypeName" && this.state.units[rowIndex][this.state.unitPropertyColumns[columnIndex]])
            return (
                <div key={key} style={style} title={this.state.units[rowIndex][this.state.unitPropertyColumnToolTip[columnIndex]]}>
                    <span className={'nameOverflow unitType ' + this.state.units[rowIndex]["UnitTypeColorCode"]}> {this.state.units[rowIndex][this.state.unitPropertyColumns[columnIndex]]} </span>
                </div>
            )
        else if ((this.state.unitPropertyColumns[columnIndex] == "UnitNickName" || this.state.unitPropertyColumns[columnIndex] == "UnitTypeName") && !this.state.units[rowIndex][this.state.unitPropertyColumns[columnIndex]]) {
            return (
                <div>

                </div>);
        }
        else if (this.state.unitPropertyColumns[columnIndex] == "UnitNickName") {
            let assignedReservationObj = {
                PropertyId: this.state.units[rowIndex]["PropertyId"],
                UnitId: this.state.units[rowIndex]["UnitId"],
                UnitTypeId: this.state.units[rowIndex]["UnitTypeId"]
            };
            return (
                <div key={key} style={style} className={'nameOverflow'} title={this.state.units[rowIndex][this.state.unitPropertyColumnToolTip[columnIndex]]}>
                    <div><span>{this.state.units[rowIndex][this.state.unitPropertyColumns[columnIndex]]}</span> <span onClick={this.showUnassignedRes.bind(this, assignedReservationObj)} className={'unassignedcount'}>{this.state.units[rowIndex]["UnassignedCount"]}</span></div>
                </div>
            )
        }
        else
            return (
                <div key={key} style={style} className={'nameOverflow'} title={this.state.units[rowIndex][this.state.unitPropertyColumnToolTip[columnIndex]]}>
                    {this.state.units[rowIndex][this.state.unitPropertyColumns[columnIndex]]}
                </div>
            )
    }

    unitPropertyNamesCellRangeRenderer({
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
        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex;) {

            let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

            for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
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


                let currUnitDetails = this.state.units[rowIndex];

                if (this.state.data[rowIndex]["unitDetails"]["IsAssigned"]) {
                    if (parent.props.showUnassigned && this.state.selectedUnitId == this.state.units[rowIndex]["UnitId"]) {
                        let unassignedCount = this.state.units[rowIndex]["UnassignedCount"] && this.state.units[rowIndex]["UnassignedCount"] > 0 ? (this.state.units[rowIndex]["UnassignedCount"]) : 1
                        // if (rowIndex > 5) {
                        //     let rowDiff = rowIndex - 5;
                        //     if (this.state.units[rowIndex]["UnassignedCount"] && this.state.units[rowIndex]["UnassignedCount"] > rowDiff) {
                        //         let indexToIncr = (this.state.units[rowIndex]["UnassignedCount"] && this.state.units[rowIndex]["UnassignedCount"] > 0 ? ((this.state.units[rowIndex]["UnassignedCount"]) - rowDiff) : 1)

                        //         if (indexToIncr === 0) {
                        //             unassignedCount = 1;
                        //         }
                        //         else
                        //             unassignedCount = indexToIncr;
                        //     }
                        //     else
                        //         unassignedCount = 1;
                        //     //unassignedCount = unassignedCount - rowDiff;
                        // }
                        if (unassignedCount > 0)
                            style.height += style.height * unassignedCount;

                    }

                    if (this.state.unitPropertyColumns[columnIndex] == "UnitTypeName" && this.state.data[rowIndex]["unitDetails"][this.state.unitPropertyColumns[columnIndex]]) {
                        renderedCells.push(
                            <div key={key} style={style} title={this.state.data[rowIndex]["unitDetails"][this.state.unitPropertyColumnToolTip[columnIndex]]}>
                                <span className={'nameOverflow unitType ' + this.state.data[rowIndex]["unitDetails"]["UnitTypeColorCode"]}> {this.state.data[rowIndex]["unitDetails"][this.state.unitPropertyColumns[columnIndex]]} </span>
                            </div>
                        )
                    }
                    else if (this.state.unitPropertyColumns[columnIndex] == "UnitNickName") {
                        let assignedReservationObj = {
                            PropertyId: this.state.data[rowIndex]["unitDetails"]["PropertyId"],
                            UnitId: this.state.data[rowIndex]["unitDetails"]["UnitId"],
                            UnitTypeId: this.state.data[rowIndex]["unitDetails"]["UnitTypeId"]
                        };
                        renderedCells.push(
                            <div key={key} style={style} className={'nameOverflow unitnickname'} title={this.state.data[rowIndex]["unitDetails"][this.state.unitPropertyColumnToolTip[columnIndex]]}>
                                <div>
                                    <span>{this.state.data[rowIndex]["unitDetails"][this.state.unitPropertyColumns[columnIndex]]}</span>
                                    <div className={'unassignedUnitArea'}>
                                        {/* {this.state.units[rowIndex]["UnassignedCount"] ? <span onClick={this.showUnassignedRes.bind(this, assignedReservationObj)} className={'unassignedcount'}>{'(' + this.state.units[rowIndex]["UnassignedCount"] + ')'}</span> : ''} */}
                                        {parent.props.showUnassigned && this.state.selectedUnitId == this.state.data[rowIndex]["unitDetails"]["UnitId"] ? <span onClick={this.showUnassignedRes.bind(this, null)}><i class="far fa-times"></i></span> : ''}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else if ((this.state.unitPropertyColumns[columnIndex] == "UnitNickName" || this.state.unitPropertyColumns[columnIndex] == "UnitTypeName") && !this.state.data[rowIndex]["unitDetails"][this.state.unitPropertyColumns[columnIndex]]) {
                        renderedCells.push(
                            <div className={'unitnickname'}>

                            </div>);
                    }
                    else {
                        renderedCells.push(
                            <div key={key} style={style} className={'nameOverflow'} title={this.state.data[rowIndex]["unitDetails"][this.state.unitPropertyColumnToolTip[columnIndex]]}>
                                {this.state.data[rowIndex]["unitDetails"][this.state.unitPropertyColumns[columnIndex]]}
                            </div>
                        )
                    }
                }
            }

            if (parent.props.showUnassigned && this.state.selectedUnitId == this.state.data[rowIndex]["unitDetails"]["UnitId"]) {
                // console.log(rowIndex);
                // console.log(this.state.units[rowIndex]);
                // if (rowIndex > 5) {
                //     let rowDiff = rowIndex - 6;

                //     if (this.state.units[rowIndex]["UnassignedCount"] && this.state.units[rowIndex]["UnassignedCount"] > rowDiff) {

                //         let indexToIncr = (this.state.units[rowIndex]["UnassignedCount"] && this.state.units[rowIndex]["UnassignedCount"] > 0 ? ((this.state.units[rowIndex]["UnassignedCount"] + 1) - rowDiff) : 1)

                //         if (indexToIncr === 0) {
                //             rowIndex += 2;
                //         }
                //         else
                //             rowIndex += indexToIncr;
                //     }
                //     else
                //         rowIndex += 2;
                // }
                // else {
                rowIndex += (this.state.data[rowIndex]["unitDetails"]["UnassignedCount"] && this.state.data[rowIndex]["unitDetails"]["UnassignedCount"] > 0 ? (this.state.data[rowIndex]["unitDetails"]["UnassignedCount"] + 1) : 1);
                // }
            }
            else
                rowIndex++;
        }

        return renderedCells;
    }

    unitPropertyHeaderRenderer({ columnIndex, key, rowIndex, style }) {
        if (rowIndex == 1 && columnIndex == 0) {

            //console.log(style);

            let tempStyle = JSON.parse(JSON.stringify(style));
            tempStyle.width = tempStyle.width * 3;

            return (
                <div key={key} style={tempStyle} className="availHeader">
                    {/* <button className={this.state.showUnitCount ? 'has': 'perc'} onClick={this.toggleUnitsNumberAndPercentage}>#</button>
                    <button onClick={this.toggleUnitsNumberAndPercentage}>%</button> */}
                    <div className={"radioToggle"}>
                        <label><input type="radio" name={"occToggle"} disabled={this.state.showUnitCount == '$'} checked={this.state.showUnitCount == '$'} value="$" onClick={this.toggleUnitsNumberAndPercentage.bind(this, '$')} /><span>Sold Units</span></label>
                        <label><input type="radio" name={"occToggle"} disabled={this.state.showUnitCount == '#'} checked={this.state.showUnitCount == '#'} value="#" onClick={this.toggleUnitsNumberAndPercentage.bind(this, '#')} /><span>Available Units</span></label>
                        <label><input type="radio" name={"occToggle"} disabled={this.state.showUnitCount == '%'} checked={this.state.showUnitCount == '%'} value="%" onClick={this.toggleUnitsNumberAndPercentage.bind(this, '%')} /><span>Occupancy %</span></label>
                    </div>
                </div>
            )
        }
        else if (rowIndex == 1) {
            return false;
        }
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
        const renderedCells = [], renderedKeys = {}

        // if (parent.props.showUnassigned)
        //     console.log(parent.props.showUnassigned);
        // else
        //     console.log("hide");
        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            // This contains :offset (top) and :size (height) information for the cell
            let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

            let currReservations = this.state.data[rowIndex]["unitReservations"];
            let currUnitDetails = this.state.data[rowIndex]["unitDetails"];
            let dateHeadersArr = this.state.headers[0], renderedRes = {}, dayClass = null;

            // this.someFunction = function (x, obj) {
            //     console.log("row clicked ", x, obj);
            //     x.IsAssigned = !x.IsAssigned;
            // }

            // this.someFunction = this.someFunction.bind(this);

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

                if (currReservations.hasOwnProperty(dateHeadersArr[columnIndex]["date"])) {

                    let currentDateReservations = currReservations[dateHeadersArr[columnIndex]["date"]];

                    if (currentDateReservations.length > 0) {
                        let self = this, colIndexToBeIncreased = 1, htmlToRendered = null, innerHtmlToRendered = null, unassignedResRequest = null, isAssignedExists = false,
                            unassignedColToBeIncreased = 1, closeOutClass, className = null, assignedReservationObj = null,
                            assignedResEndDates = [], isOverlapped = false, assignedResStartDates = [], overlappedReservations = [];

                        dayClass = "Cell" + moment(dateHeadersArr[columnIndex]["date"]).format('ddd');


                        if (dateHeadersArr[columnIndex]["date"] === moment().format("YYYY-MM-DD")) {
                            dayClass += " today";
                        }

                        if (dateHeadersArr[columnIndex]["date"] === moment().add(-1, 'days').format("YYYY-MM-DD")) {
                            dayClass += " yesterday123";
                        }

                        let dayWeekend = clientWeekends.filter(function (weekend) {
                            return weekend.dayname == moment(dateHeadersArr[columnIndex]["date"]).format('dddd');
                        })

                        if (dayWeekend && dayWeekend.length > 0) {
                            dayClass += " weekend";
                        }

                        for (let resIndex = 0; resIndex < currentDateReservations.length; resIndex++) {

                            let currResObj = currentDateReservations[resIndex];
                            //assignedResEndDates.push(currResObj.EndDate);

                            key += `-${resIndex}-${currResObj.ReservationId}`
                            if (!renderedKeys.hasOwnProperty(key)) {
                                renderedKeys[key] = {};
                                //console.log(key);
                                //Currency should be get from Client/Property set up                    


                                closeOutClass = currResObj["Closeout"] ? (' Closeout ' + currResObj.StartDate) : '';

                                if (currResObj.ReservationId === -1 && currResObj.IsOccupancy) {
                                    renderedCells.push(<div key={key + '-occupancy'} style={style} className={'resAvailable ' + dayClass + ' availHeader'}>
                                        {parent.props.showUnitCount == '#' ? currResObj.AvailUnitsCount : currResObj.AvailUnitsPercent}
                                    </div>);
                                }
                                else if (currResObj.ReservationId === -1) {//} || !parent.props.showResGrid) {
                                    renderedCells.push(<div attr={key + '-notOccupied'} key={key} style={style} className={'resAvailable ' + dayClass}>
                                        <span>{currResObj.Amount ? '$ ' + currResObj.Amount : ''}</span>
                                        <span className='minStay'>{currResObj.MinStayValue ? currResObj.MinStayValue + 'N' : ''}</span>
                                        <span className={currResObj.NoCheckin ? 'nocheckin' : ''}></span>
                                        <span className={currResObj.NoCheckout ? 'nocheckout' : ''}></span>
                                        {closeOutClass ? <span style={{ width: style.width, left: 0 }} className={'Closeout ' + currResObj.StartDate + ' ' + currUnitDetails.UnitNickName}></span> : ''}
                                    </div>);
                                }
                                else {
                                    const colIndex = JSON.stringify(JSON.parse(columnIndex));

                                    style.cursor = "pointer";
                                    let noOfNights = moment.utc(currResObj.EndDate).diff(moment.utc(currResObj.StartDate), "days");

                                    // if (className && className.indexOf("Closeout") > -1) {
                                    //     className = (currResObj.SourceName ? ' ' + currResObj.SourceName : '') + ' Closeout';
                                    // }
                                    // else {
                                    className = (currResObj.SourceName ? ' ' + currResObj.SourceName : '');
                                    // }

                                    if (currResObj.IsAssigned) {
                                        if (noOfNights)
                                            colIndexToBeIncreased = noOfNights;

                                        assignedReservationObj = {
                                            PropertyId: currResObj.PropertyId,
                                            StartDate: currResObj.StartDate,
                                            EndDate: currResObj.EndDate,
                                            UnitId: currResObj.IsAssigned ? currResObj.UnitId : currResObj.ActualUnitId,
                                            UnitTypeId: currResObj.IsAssigned ? currResObj.UnitTypeId : [currResObj.ActualUnitTypeId, nextResObj.UnitTypeId],
                                            ReservationId: currResObj.ReservationId
                                        };


                                        //console.log(currResObj.ReservationId + "/"  +dateHeadersArr[columnIndex]["date"]);

                                        for (let mIndex = 0; mIndex < noOfNights; mIndex++) {
                                            let nextToTheStartDate = moment(currResObj.StartDate).add(mIndex, "days");
                                            let nextDateReservations = currReservations[moment(nextToTheStartDate).format("YYYY-MM-DD")];

                                            // console.log("next date res =>", nextDateReservations);
                                            if (!nextDateReservations)
                                                nextDateReservations = [];

                                            for (let nIndex = 0; nIndex < nextDateReservations.length; nIndex++) {
                                                let nextResObj = nextDateReservations[nIndex];
                                                if (nextResObj.ReservationId > 0 && nextResObj.StartDate && currResObj.StartDate && nextResObj.EndDate && moment(nextResObj.StartDate).format("YYYY-MM-DD") >= moment(currResObj.StartDate).format("YYYY-MM-DD")
                                                    && moment(nextResObj.StartDate).format("YYYY-MM-DD") <= moment(nextResObj.EndDate).format("YYYY-MM-DD")) {
                                                    if (!renderedRes.hasOwnProperty(nextResObj.ReservationId)) {
                                                        renderedRes[nextResObj.ReservationId] = {};

                                                        //console.log("Reservation ID => ", nextResObj.ReservationId);
                                                        // if (className && className.indexOf("Closeout") > -1) {
                                                        //     className = (nextResObj.SourceName ? ' ' + nextResObj.SourceName : '') + ' Closeout';
                                                        // }
                                                        // else
                                                        className = (nextResObj.SourceName ? ' ' + nextResObj.SourceName : '');

                                                        //if (moment(nextResObj.EndDate).format("YYYY-MM-DD") > moment(assignedResEndDate).format("YYYY-MM-DD")) {
                                                        assignedResEndDates.push(moment(nextResObj.EndDate));
                                                        assignedResStartDates.push(moment(nextResObj.StartDate));
                                                        //}

                                                        // if (moment(nextResObj.StartDate).format("YYYY-MM-DD") < moment(assignedResStartDate).format("YYYY-MM-DD")) {
                                                        //     assignedResStartDate = nextResObj.StartDate;
                                                        // }

                                                        //let nextResNights = moment(nextResObj.EndDate).diff(nextResObj.ActualStartDate, "days");
                                                        let nextResNights = moment.utc(nextResObj.EndDate).diff(moment.utc(nextResObj.StartDate), "days");
                                                        //console.log(nextResObj["GuestName"], " nights => ", nextResNights);

                                                        if (moment.utc(dateHeadersArr[columnIndex]["date"]).format("YYYY-MM-DD") > moment.utc(nextResObj.StartDate).format("YYYY-MM-DD")) {
                                                            nextResNights = nextResNights - moment.utc(moment.utc(dateHeadersArr[columnIndex]["date"]).format("YYYY-MM-DD")).diff(moment.utc(nextResObj.StartDate).format("YYYY-MM-DD"), 'days');
                                                            // console.log(" nights => ", moment(dateHeadersArr[columnIndex]["date"]).diff(nextResObj.ActualStartDate, 'days'));
                                                            // console.log(nextResObj);
                                                        }

                                                        let unassignedStyles = {};
                                                        if (!nextResObj.IsAssigned && moment(nextResObj.StartDate).diff(dateHeadersArr[columnIndex]["date"], "days")) {
                                                            unassignedStyles.left = style.width * (moment(nextResObj.StartDate).diff(dateHeadersArr[columnIndex]["date"], "days"));
                                                        }


                                                        //console.log("diff days =>", nextResObj.ActualStartDate, dateHeadersArr[columnIndex]["date"]);

                                                        unassignedStyles.width = (style.width * (nextResNights ? nextResNights : 1)) - 14;
                                                        if (innerHtmlToRendered) {
                                                            innerHtmlToRendered = [innerHtmlToRendered, <span style={unassignedStyles} className={'first statusType nameOverflow ' + nextResObj.ReservationStatus + ' ' + className + ' ' + (nextResObj.IsAssigned ? 'assigned' : 'unassigned')} title={nextResObj["GuestName"]}>
                                                                {nextResObj["GuestName"]}
                                                            </span>];
                                                            // isMultipleResExist = true;
                                                        }
                                                        else {
                                                            innerHtmlToRendered = <span style={unassignedStyles} className={'first statusType nameOverflow ' + nextResObj.ReservationStatus + ' ' + className + ' ' + (nextResObj.IsAssigned ? 'assigned' : 'unassigned')} title={nextResObj["GuestName"]}>
                                                                {nextResObj["GuestName"]}
                                                            </span>;
                                                        }

                                                        overlappedReservations.push(nextResObj.ReservationId);

                                                        innerHtmlToRendered = [innerHtmlToRendered, nextResObj.Closeout ? <span style={unassignedStyles} className={'1 Closeout'}></span> : ''];
                                                    }
                                                }
                                                else {

                                                    if (nextResObj.StartDate && currResObj.StartDate && nextResObj.EndDate) {
                                                        if (!renderedRes.hasOwnProperty(nextResObj.ReservationId)) {
                                                            renderedRes[nextResObj.ReservationId] = {};

                                                            // if (moment(nextResObj.EndDate).format("YYYY-MM-DD") > moment(assignedResEndDate).format("YYYY-MM-DD")) {
                                                            //     assignedResEndDate = nextResObj.EndDate;
                                                            //     console.log("override date=>", assignedResEndDate);
                                                            // }

                                                            // if (moment(nextResObj.StartDate).format("YYYY-MM-DD") < moment(assignedResStartDate).format("YYYY-MM-DD")) {
                                                            //     assignedResStartDate = nextResObj.StartDate;
                                                            // }
                                                            assignedResEndDates.push(moment(nextResObj.EndDate));
                                                            assignedResStartDates.push(moment(nextResObj.StartDate));


                                                            //let nextResNights = moment(nextResObj.EndDate).diff(nextResObj.StartDate, "days");
                                                            let nextResNights = moment.utc(nextResObj.EndDate).diff(moment.utc(nextResObj.StartDate), "days");

                                                            if (moment.utc(dateHeadersArr[columnIndex]["date"]).format("YYYY-MM-DD") > moment.utc(nextResObj.StartDate).format("YYYY-MM-DD")) {
                                                                nextResNights = nextResNights - moment.utc(moment.utc(dateHeadersArr[columnIndex]["date"]).format("YYYY-MM-DD")).diff(moment.utc(nextResObj.StartDate).format("YYYY-MM-DD"), 'days');
                                                            }

                                                            let unassignedStyles = {};
                                                            if (!nextResObj.IsAssigned && moment(nextResObj.StartDate).diff(dateHeadersArr[columnIndex]["date"], "days")) {
                                                                unassignedStyles.left = style.width * (moment(nextResObj.StartDate).diff(dateHeadersArr[columnIndex]["date"], "days"));
                                                            }

                                                            unassignedStyles.width = (style.width * (nextResNights ? nextResNights : 1)) - 14;
                                                            if (innerHtmlToRendered) {
                                                                innerHtmlToRendered = [innerHtmlToRendered, <span style={unassignedStyles} className={'first statusType nameOverflow ' + nextResObj.ReservationStatus + ' ' + className + ' ' + (nextResObj.IsAssigned ? 'assigned' : 'unassigned')} title={nextResObj["GuestName"]}>
                                                                    {nextResObj["GuestName"]}
                                                                </span>];
                                                                // isMultipleResExist = true;
                                                            }
                                                            else {
                                                                innerHtmlToRendered = <span style={unassignedStyles} className={'first statusType nameOverflow ' + nextResObj.ReservationStatus + ' ' + className + ' ' + (nextResObj.IsAssigned ? 'assigned' : 'unassigned')} title={nextResObj["GuestName"]}>
                                                                    {nextResObj["GuestName"]}
                                                                </span>;
                                                            }
                                                            overlappedReservations.push(nextResObj.ReservationId);
                                                            innerHtmlToRendered = [innerHtmlToRendered, nextResObj.Closeout ? <span style={unassignedStyles} className={'2 Closeout'}></span> : ''];
                                                        }
                                                    }
                                                    //console.log(currResObj.GuestName);
                                                }
                                            }

                                        }



                                        isAssignedExists = true;
                                    }
                                    else if (!currResObj.IsAssigned && currResObj.ReservationId > 0) {

                                        // className += " multiple";                                    

                                        for (let mIndex = 0; mIndex < noOfNights; mIndex++) {
                                            let nextToTheStartDate = moment(currResObj.StartDate).add(mIndex, "days");
                                            let nextDateReservations = currReservations[moment(nextToTheStartDate).format("YYYY-MM-DD")];

                                            if (!nextDateReservations)
                                                nextDateReservations = [];

                                            for (let nIndex = 0; nIndex < nextDateReservations.length; nIndex++) {
                                                let nextResObj = nextDateReservations[nIndex];
                                                if (nextResObj.ReservationId > 0 && nextResObj.StartDate && currResObj.StartDate && nextResObj.EndDate && moment(nextResObj.StartDate).format("YYYY-MM-DD") >= moment(currResObj.StartDate).format("YYYY-MM-DD")
                                                    && moment(nextResObj.StartDate).format("YYYY-MM-DD") <= moment(nextResObj.EndDate).format("YYYY-MM-DD")) {
                                                    if (!renderedRes.hasOwnProperty(nextResObj.ReservationId)) {
                                                        renderedRes[nextResObj.ReservationId] = {};

                                                        //console.log(nextResObj.ReservationId);
                                                        // if (className && className.indexOf("Closeout") > -1) {
                                                        //     className = " multiple " + (nextResObj.SourceName ? ' ' + nextResObj.SourceName : '') + ' Closeout';
                                                        // }
                                                        // else
                                                        className = " multiple " + (nextResObj.SourceName ? ' ' + nextResObj.SourceName : '');

                                                        //console.log("Reservation ID => ", nextResObj.ReservationId);

                                                        assignedResEndDates.push(moment(nextResObj.EndDate));
                                                        assignedResStartDates.push(moment(nextResObj.StartDate));

                                                        let nextResNights = moment(nextResObj.EndDate).diff(nextResObj.StartDate, "days");

                                                        if (moment(dateHeadersArr[columnIndex]["date"]).format("YYYY-MM-DD") > moment(nextResObj.StartDate).format("YYYY-MM-DD")) {
                                                            nextResNights = nextResNights - moment(moment(dateHeadersArr[columnIndex]["date"]).format("YYYY-MM-DD")).diff(moment(nextResObj.StartDate).format("YYYY-MM-DD"), 'days');
                                                        }

                                                        let unassignedStyles = {};

                                                        if (moment(nextResObj.StartDate).diff(dateHeadersArr[columnIndex]["date"], "days")) {
                                                            unassignedStyles.left = style.width * (moment(nextResObj.StartDate).diff(dateHeadersArr[columnIndex]["date"], "days"));
                                                        }

                                                        //console.log("diff days =>", nextResObj.ActualStartDate, dateHeadersArr[columnIndex]["date"]);

                                                        unassignedStyles.width = (style.width * (nextResNights ? nextResNights : 1)) - 14;
                                                        if (innerHtmlToRendered) {
                                                            innerHtmlToRendered = [innerHtmlToRendered, <span title={nextResObj["GuestName"]} style={unassignedStyles} className={'second statusType nameOverflow ' + nextResObj.ReservationStatus + ' ' + className + ' ' + (nextResObj.IsAssigned ? 'assigned' : 'unassigned')}>{nextResObj.GuestName}</span>
                                                            ];
                                                            // isMultipleResExist = true;
                                                        }
                                                        else {
                                                            // console.log("second and single =>", nextResObj);
                                                            innerHtmlToRendered = <span style={unassignedStyles} title={nextResObj["GuestName"]} className={'second statusType nameOverflow ' + nextResObj.ReservationStatus + ' ' + className + ' ' + (nextResObj.IsAssigned ? 'assigned' : 'unassigned')}>{nextResObj.GuestName}</span>;
                                                        }
                                                        overlappedReservations.push(nextResObj.ReservationId);

                                                        innerHtmlToRendered = [innerHtmlToRendered, nextResObj.Closeout ? <span style={unassignedStyles} className={'3 Closeout'}></span> : ''];

                                                        if (!unassignedResRequest) {
                                                            unassignedResRequest = {
                                                                PropertyId: nextResObj.PropertyId,
                                                                StartDate: nextResObj.StartDate,
                                                                EndDate: nextResObj.EndDate,
                                                                UnitId: nextResObj.IsAssigned ? nextResObj.UnitId : nextResObj.ActualUnitId,
                                                                UnitTypeId: nextResObj.IsAssigned ? nextResObj.UnitTypeId : [nextResObj.ActualUnitTypeId, nextResObj.UnitTypeId],
                                                                ReservationId: nextResObj.ReservationId,
                                                                IsAssigned: nextResObj.IsAssigned
                                                            };
                                                        }
                                                        else if (unassignedResRequest && !unassignedResRequest.IsAssigned) {
                                                            if (typeof unassignedResRequest.UnitTypeId == "object") {
                                                                unassignedResRequest.UnitTypeId.push(nextResObj.ActualUnitTypeId)
                                                                unassignedResRequest.UnitTypeId.push(nextResObj.UnitTypeId);
                                                            }
                                                            else {
                                                                unassignedResRequest.UnitTypeId = [nextResObj.ActualUnitTypeId, nextResObj.UnitTypeId]
                                                            }
                                                        }

                                                        unassignedResRequest.ReservationId = nextResObj.ReservationId;

                                                    }
                                                    else {
                                                        if (currResObj.ReservationId > 0 && nextResObj.ReservationId > 0 && currResObj.ReservationId != nextResObj.ReservationId) {
                                                            // console.log("Overlapped res =>", nextResObj);
                                                            isOverlapped = true;
                                                        }
                                                    }
                                                }
                                                else if (!currResObj.IsAssigned && nextResObj.ReservationId == -1 && nextResObj.Closeout) {

                                                    let unassignedStyles = {};

                                                    if (moment(nextResObj.StartDate).diff(dateHeadersArr[columnIndex]["date"], "days")) {
                                                        unassignedStyles.left = style.width * (moment(nextResObj.StartDate).diff(dateHeadersArr[columnIndex]["date"], "days"));
                                                    }

                                                    unassignedStyles.width = style.width;

                                                    if (innerHtmlToRendered) {
                                                        innerHtmlToRendered = [innerHtmlToRendered, <span style={unassignedStyles} className={'second Closeout'}>{''}</span>
                                                        ];
                                                    }
                                                    else {
                                                        innerHtmlToRendered = <span style={unassignedStyles} className={'second Closeout '}>{''}</span>
                                                    }
                                                }
                                                else {
                                                    // console.log(currResObj.GuestName);
                                                    // console.log(nextResObj.GuestName);
                                                }
                                            }

                                        }

                                        if (noOfNights > unassignedColToBeIncreased)
                                            unassignedColToBeIncreased = noOfNights;
                                    }
                                    else if (currResObj.ReservationId > 0 || nextResObj.ReservationId > 0) {
                                        // console.log(currResObj);
                                        // console.log(nextResObj);
                                    }


                                    if (unassignedResRequest) {
                                        unassignedResRequest.EndDate = moment(Math.max.apply(null, assignedResEndDates)).format("YYYY-MM-DD") //assignedResEndDate;
                                        unassignedResRequest.StartDate = moment(Math.min.apply(null, assignedResStartDates)).format("YYYY-MM-DD") //assignedResStartDate
                                    }
                                    if (assignedReservationObj) {
                                        assignedReservationObj.EndDate = moment(Math.max.apply(null, assignedResEndDates)).format("YYYY-MM-DD")//assignedResEndDate;
                                        assignedReservationObj.StartDate = moment(Math.min.apply(null, assignedResStartDates)).format("YYYY-MM-DD")
                                    }

                                }

                            }
                            else {
                                renderedCells.push(<div key={key + '-missing'} attr={key} style={style} className={'resAvailable ' + dayClass}>
                                    {''}
                                </div>);
                            }
                        }

                        if (innerHtmlToRendered) {
                            //console.log(innerHtmlToRendered);

                            if (!assignedReservationObj) {
                                assignedReservationObj = unassignedResRequest
                            }
                            else if (!unassignedResRequest) {
                                unassignedResRequest = assignedReservationObj
                            }

                            if (isAssignedExists) {
                                style.width = style.width * colIndexToBeIncreased;
                                columnIndex += colIndexToBeIncreased;
                            }
                            else {
                                style.width = style.width * unassignedColToBeIncreased;
                                columnIndex += unassignedColToBeIncreased;
                            }

                            if ((innerHtmlToRendered.length && overlappedReservations.length > 1) || isOverlapped) {
                                renderedCells.push(<div attr={key + '-overlappedRes'} key={key + '-overlappedRes'} style={style} className={dayClass + ' multiple ' + className} onClick={this.showUnassignedRes.bind(this, assignedReservationObj)}>{innerHtmlToRendered} </div>);
                            }
                            else {
                                //  className += assignedReservationObj.IsAssigned ? " itsCustom" : " notCustom";
                                renderedCells.push(<div attr={key + '-itsCustom'} key={key + '-itsCustom'} style={style} className={dayClass + ' ' + className} onClick={this.navigateToReservations.bind(this, assignedReservationObj)}>{innerHtmlToRendered} </div>);
                            }
                        }
                        else {
                            columnIndex += colIndexToBeIncreased;
                        }
                    }
                    else {
                        //renderedCells.push(<div key={key} style={style} className={dayClass + ' ' + className}>{""} </div>);
                        columnIndex++;
                    }
                }
                else {
                    //renderedCells.push(<div key={key} style={style} className={dayClass + ' ' + className}>{""} </div>);
                    columnIndex++;
                    if (!renderedKeys.hasOwnProperty(key)) {
                        renderedKeys[key] = {};
                        renderedCells.push(<div key={key + '-elseCondition'} attr={key + '-elseCondition'} style={style} className={'resAvailable ' + dayClass}>
                            {''}
                        </div>);
                    }
                    console.log("no reservations found");
                }

                //console.log(renderedKeys);
            }
        }

        return renderedCells
    }


    showUnassignedRes(currResObj) {
        let self = this;
        self.state.events.showLoading();

        if (!currResObj) {
            this.setState((state, prevProps) => {
                // Important: read `state` instead of `this.state` when updating.            
                return { data: state.originalData, showUnassigned: false, selectedUnitId: null, units: originalUnits }
            });
            self.state.events.showLoading();
        }
        else {
            const data = new FormData();
            data.append('requestParams', JSON.stringify({
                startDate: self.state.filterObj.startDate ? moment.utc(self.state.filterObj.startDate).format("YYYY-MM-DD") : moment.utc().format("YYYY-MM-DD"),
                endDate: self.state.filterObj.endDate ? moment.utc(self.state.filterObj.endDate).format("YYYY-MM-DD") : moment.utc().add(90, 'days').format("YYYY-MM-DD"),
                propertyId: currResObj.PropertyId,
                unitId: currResObj.UnitId,
                unitTypeId: currResObj.UnitTypeId,
                APIReg: 10010,
            })
            );
            data.append('systemParams', JSON.stringify({
                token: window.localStorage.getItem('rttoken'),
                Source: "Web",
                SourceId: window.location.hostname,
            }));

            fetch(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":1339" : '') + '/api', {
                method: 'POST',
                body: data
            }).then(response => {
                response.json().then(formattedResponse => {
                    if (formattedResponse.err) {
                        console.log("Error returned from server => ", formattedResponse.err);
                        return;
                    }
                    if (formattedResponse.response) {
                        let responseOj = formattedResponse.response;

                        let tempData = JSON.parse(JSON.stringify(self.state.data));
                        let tempUnits = JSON.parse(JSON.stringify(self.state.units))

                        if (self.state.showUnassigned) {
                            this.setState((state, prevProps) => {
                                return { showUnassigned: !state.showUnassigned, selectedUnitId: null, units: state.originalUnits }
                            });

                            tempData = JSON.parse(JSON.stringify(self.state.originalData));
                            tempUnits = JSON.parse(JSON.stringify(self.state.originalUnits));
                        }

                        let unitIndex = tempData.findIndex((currUnit) => {
                            return currUnit.unitDetails.UnitId === currResObj.UnitId;
                        });

                        let unitIndexFromUnitList = tempUnits.findIndex((currUnit) => {
                            return currUnit.UnitId === currResObj.UnitId;
                        });

                        for (let rIndex = 0; rIndex < responseOj.reservations.length; rIndex++) {
                            tempData.splice(unitIndex + 1, 0, responseOj.reservations[rIndex]);
                        }

                        tempData.splice(unitIndex, 1);
                        //let unassignedCount = tempUnits[unitIndexFromUnitList]["AssignedCount"] ? tempUnits[unitIndexFromUnitList]["UnassignedCount"] : (tempUnits[unitIndexFromUnitList]["UnassignedCount"] - 1);

                        for (let uIndex = 0; uIndex < tempUnits[unitIndexFromUnitList]["UnassignedCount"]; uIndex++) {
                            //tempUnits[unitIndexFromUnitList]['countTobeIncresed'] = unassignedCount;
                            let parsedCurrUnit = JSON.parse(JSON.stringify(tempUnits[unitIndexFromUnitList]));
                            if (parsedCurrUnit["UnassignedCount"])
                                parsedCurrUnit["UnassignedCount"] = parsedCurrUnit["UnassignedCount"] - (uIndex + 1);// > 0 ? parsedCurrUnit["UnassignedCount"] - (uIndex + 1) : 1;

                            tempUnits.splice(unitIndexFromUnitList + uIndex + 1, 0, parsedCurrUnit);
                        }

                        this.setState((state, prevProps) => {
                            // Important: read `state` instead of `this.state` when updating.            
                            return { data: tempData, showUnassigned: !state.showUnassigned, selectedUnitId: currResObj.UnitId, units: tempUnits }
                        });

                        //self.forceUpdate();

                        self.state.events.showLoading();
                    }
                    else {
                        window.location.href = "login.html";
                    }
                });
            });
        }
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
                //scrollTop: props.scrollTop,
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
        // this.setState({
        //     gridProps: {
        //         clientHeight: props.clientHeight,
        //         clientWidth: props.clientWidth,
        //         scrollHeight: props.scrollHeight,
        //         scrollLeft: props.scrollLeft,
        //         scrollTop: props.scrollTop,
        //         scrollWidth: props.scrollWidth
        //     }
        // });
    }

    scrollTopList() {

    }

    navigateToReservations(resObj) {
        console.log(resObj);
        if (resObj) {
            this.state.events.navigateToReservation(resObj);
        }
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

    toggleUnitsNumberAndPercentage(toggleValue) {
        this.setState((state, prevProps) => {
            // Important: read `state` instead of `this.state` when updating.            
            return { showUnitCount: toggleValue }
        });
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
                                columnWidth={150}
                                height={100}
                                rowCount={2}
                                rowHeight={50}
                                width={470}
                                // {...this.state.gridProps}
                                showUnitCount={this.state.showUnitCount}
                            />
                        </div>
                        <div className='unitsList RightColumn'>
                            <Grid
                                cellRenderer={this.unitPropertyNamesRenderer}
                                columnCount={3}
                                columnWidth={150}
                                height={window.innerHeight - 240}
                                rowCount={this.state.units.length}
                                rowHeight={45}
                                width={470}
                                onScroll={this.onScrollUnitPropertyGrid}
                                {...this.state.verticalGridProps}
                                showUnassigned={this.state.showUnassigned}
                                cellRangeRenderer={this.unitPropertyNamesCellRangeRenderer}
                            />
                        </div>
                    </div>
                    <div className='Table'>
                        <div className='LeftColumn' style={this.state.dateHeadersStyle}>
                            <Grid
                                cellRenderer={this.headerRenderer}
                                columnCount={this.state.headers[0].length}
                                columnWidth={70}
                                height={100}
                                rowCount={2}
                                rowHeight={50}
                                width={window.innerWidth - 580}
                                // onScroll={this.onScrollHeaderGrid}
                                cellRangeRenderer={this.headerCellRangeRenderer}
                                showUnitCount={this.state.showUnitCount}
                                onScroll={this.onScrollHeaderGrid}
                                {...this.state.gridProps}
                            />
                        </div>
                        <div className='RightColumn'>
                            {/* <InfiniteLoader
                            isRowLoaded={this.isRowLoaded}
                            loadMoreRows={this.loadMoreRows}
                            rowCount={this.state.data.length}
                        > */}
                            {/* {({ onRowsRendered, registerChild }) => ( */}
                            <Grid
                                cellRenderer={this.cellRenderer}
                                onSectionRendered={this.onSectionRendered}
                                columnCount={this.state.headers[0].length}
                                columnWidth={70}
                                height={window.innerHeight - 220}
                                rowCount={this.state.data.length}
                                rowHeight={45}
                                width={window.innerWidth - 560}
                                // width={dateHeaders[0].length * 70 > window.innerWidth - 560 ? window.innerWidth - 560 : (dateHeaders[0].length * 70 + 20)}
                                onScroll={this.onScrollGrid}
                                cellRangeRenderer={this.cellRangeRenderer}
                                {...this.state.gridProps}
                                showUnitCount={this.state.showUnitCount}
                                showResGrid={this.state.showResGrid}
                                showUnassigned={this.state.showUnassigned}
                            // ref={registerChild}
                            />
                            {/* )} */}
                            {/* </InfiniteLoader> */}
                        </div>
                    </div>
                </div>
            )}
        </ScrollSync>
    }
}

export default function reactGrid(el) {

    this.init = (tapeChartProps) => {
        ReactDOM.unmountComponentAtNode(el);

        data = tapeChartProps._data;
        originalData = tapeChartProps._data;
        dateHeaders = tapeChartProps._dateHeaders;
        events = tapeChartProps._events;
        properties = tapeChartProps._properties;
        units = tapeChartProps._units;
        originalUnits = tapeChartProps._units;
        filterObj = tapeChartProps._filterObj;
        clientWeekends = tapeChartProps._clientWeekends

        ReactDOM.render(<ReactGrid />, el);

        // events.toggleButton = function(flag){
        //     console.log(flag);
        //     ReactDOM.unmountComponentAtNode(el);
        //     ReactDOM.render(<ReactGrid showUnitCount={!flag} />, el);
        // }
    }

    this._init = (data, dateHeaders, ratesCount) => {
        //ReactDOM.render(e(LikeButton), el);

        this.state = {
            gridProps: {
                clientHeight: 100,
                clientWidth: 100,
                scrollHeight: 100,
                scrollLeft: null,
                scrollTop: null,
                scrollWidth: 100
            }
        };

        // Grid data as an array of arrays
        const list = data ? data : [
            ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */]
            // And so on...
        ],
            headers = dateHeaders,
            resHeaders = ['StartDate', 'ConfirmationNumber', 'GuestName', 'Reservationstatus'],
            listData = [1, 2.3, 4, 5, 6, 7],
            gridProps = {
                clientHeight: 100,
                clientWidth: 100,
                scrollHeight: 100,
                scrollLeft: null,
                scrollTop: null,
                scrollWidth: 100
            };




        function getColumnValue(columnIndex, key, rowIndex) {
            if (resHeaders[columnIndex] === "StartDate") {
                return moment(list[rowIndex]["StartDate"]).format('DD MMM YYYY')
            }
            else {
                return list[rowIndex][resHeaders[columnIndex]]
            }
        }

        function headerRenderer({ columnIndex, key, rowIndex, style }) {
            return (
                <div
                    key={key}
                    style={style}
                >
                    {moment(headers[columnIndex]).format('DD MMM') + ' ' + moment(headers[columnIndex]).format('ddd')}
                </div>
            )
        }

        function cellRenderer({ columnIndex, key, rowIndex, style }) {

            // return (
            //     <div key={key} style={style}>
            //         {getColumnValue(columnIndex, key, rowIndex)}
            //     </div>
            // )

            return (
                <div key={key} style={style}>
                    {list[rowIndex][columnIndex]["Amount"]}
                </div>
            )
        }

        function cellRangeRenderer(props) {
            const children = defaultCellRangeRenderer(props)
            children.push(
                <div>My custom overlay</div>
            )
            return children
        }

        function onSectionRendered() {
            console.log("Section rendered");
        }

        function onScrollGrid(props) {
            console.log(props);
            gridProps.clientHeight = props.clientHeight;
            gridProps.clientWidth = props.clientWidth;
            gridProps.scrollHeight = props.scrollHeight;
            gridProps.scrollLeft = props.scrollLeft;
            gridProps.scrollTop = props.scrollTop;
            gridProps.scrollWidth = props.scrollWidth;
        }

        function onScrollHeaderGrid(props) {
            console.log(props);
            gridProps.clientHeight = props.clientHeight;
            gridProps.clientWidth = props.clientWidth;
            gridProps.scrollHeight = props.scrollHeight;
            gridProps.scrollLeft = props.scrollLeft;
            gridProps.scrollTop = props.scrollTop;
            gridProps.scrollWidth = props.scrollWidth;
        }

        function scrollTopList() {

        }

        function rowRenderer({
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

        // Render your grid
        ReactDOM.render(
            // <div>
            //     <div className='HeaderColumn'>
            //         <Grid
            //             cellRenderer={headerRenderer}
            //             columnCount={headers.length}
            //             columnWidth={150}
            //             height={50}
            //             rowCount={1}
            //             rowHeight={30}
            //             width={1800}
            //         />
            //     </div>
            //     <div className='GridData'>
            //         <Grid
            //             cellRenderer={cellRenderer}
            //             onSectionRendered={onSectionRendered}
            //             columnCount={headers.length}
            //             columnWidth={150}
            //             height={300}
            //             rowCount={ratesCount}
            //             rowHeight={30}
            //             width={1800}
            //         />
            //     </div>
            // </div>,
            <ScrollSync>
                {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
                    <div className='Table'>
                        <div className='LeftColumn'>
                            <Grid
                                cellRenderer={headerRenderer}
                                columnCount={headers.length}
                                columnWidth={150}
                                height={50}
                                rowCount={1}
                                rowHeight={30}
                                width={1800}
                                onScroll={onScrollHeaderGrid}
                                {...gridProps}
                            />
                        </div>
                        <div className='RightColumn'>
                            <Grid
                                cellRenderer={cellRenderer}
                                onSectionRendered={onSectionRendered}
                                columnCount={headers.length}
                                columnWidth={150}
                                height={50}
                                rowCount={data.length}
                                rowHeight={30}
                                width={1800}
                                onScroll={onScrollGrid}
                                {...gridProps}
                            />
                        </div>
                    </div>
                )}
            </ScrollSync>,
            el
        );
    };

    this.destroy = (el) => {
        ReactDOM.unmountComponentAtNode(el);
    }

    this.applyData = (data) => {

    };

    this.update = (tapeChartProps) => {
        ReactDOM.unmountComponentAtNode(el);

        if (tapeChartProps._data) {
            data = tapeChartProps._data;
            originalData = tapeChartProps._data;
            dateHeaders = tapeChartProps._dateHeaders;
            events = tapeChartProps._events;
            properties = tapeChartProps._properties;
            units = tapeChartProps._units;
            clientWeekends = tapeChartProps._clientWeekends
        }

        showResGrid = tapeChartProps.showResGrid;

        ReactDOM.render(<ReactGrid />, el);
    }
}
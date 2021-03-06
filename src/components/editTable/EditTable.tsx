import * as React from 'react';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
// import ColorPicker from 'material-ui-color-picker';
//import { BlockPicker } from 'react-color'
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ColorPicker from '../colorPicker/ColorPicker';
import Chip from 'material-ui/Chip';
import Toggle from 'material-ui/Toggle';
import Check from 'material-ui/svg-icons/navigation/check';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Delete from 'material-ui/svg-icons/action/delete';

export interface ColumnProps {
    value: string | boolean | object;
    width?: number | string;
    type: string;
    dataIndex: string;
}

export interface RowProps {
    columns: Array<ColumnProps>;
    id?: string | number;
    selected: boolean;
    phantom: boolean;
    primaryId: string | number;
}

export interface EditTableProps {
    headerColumns: Array<ColumnProps>;
    rows?: Array<RowProps>;
    onChange: Function;
    onDelete: Function;
    enableDelete: boolean;
    dataSource: Array<any>
}

export interface EditTableState {
    rows: Array<RowProps>;
    hoverValue: boolean;
    currentRow: boolean;
    popoverOpen: boolean;
    anchorEl: any;
}

export default class EditTable extends React.Component<EditTableProps, EditTableState> {

    constructor(props: EditTableProps) {
        super(props);
        this.state = {
            rows: [],
            hoverValue: false,
            currentRow: false,
            popoverOpen: false,
            anchorEl: {}
        };
    }

    static defaultProps = {
        headerColumns: [],
        rows: [],
        enableDelete: true,
        onChange: function () { },
        onDelete: function () { }
    };

    update = () => {
        const row = this.state.rows.filter((row: any) => {
            return row.selected
        })[0];
        let rowData = row.columns.reduce((data, { dataIndex, value }) => Object.assign(data, { [dataIndex]: value }), {});
        rowData['phantom'] = row.phantom;
        rowData['id'] = row.primaryId;
        if (rowData['name'] && rowData['bgColor'] && rowData['fontColor']) {
            this.props.onChange(rowData);
        }
    };

    getCellValue = (cell: any) => {
        const self = this;
        const id = cell && cell.id;
        const type = this.props.headerColumns.map((header: any) => {
            return header.type
        })[id];
        const selected = cell && cell.selected;
        const value = cell && cell.value;
        const rowId = cell && cell.rowId;
        const header = cell && cell.header;
        const width = cell && cell.width;
        const textFieldId = [id, rowId, header, 'text'].join('-');
        const datePickerId = [id, rowId, header, 'date'].join('-');
        const colorPickerId = [id, rowId, header, 'color'].join('-');

        const textFieldStyle = {
            width: width
        };

        const datePickerStyle = {
            width: width
        };

        const onTextFieldChange = (e: any) => {
            const target = e.target
            const value = target.value
            var rows = self.state.rows
            rows[rowId].columns[id].value = value
            if (id == 0) {
                rows[rowId].columns[4].value['text'] = value;
            }
            self.setState({ rows: rows })
        };

        const onDatePickerChange = (e: any, date: any) => {
            var rows = self.state.rows
            rows[rowId].columns[id].value = date
            self.setState({ rows: rows })
        };

        const onToggle = (e: any) => {
            var rows = self.state.rows
            rows[rowId].columns[id].value = !rows[rowId].columns[id].value
            self.setState({ rows: rows })
        };

        const onColorPickerChange = (color: any) => {
            var rows = self.state.rows
            rows[rowId].columns[id].value = color
            if (id == 1) {
                rows[rowId].columns[4].value['bgColor'] = color;
            } else if (id == 2) {
                rows[rowId].columns[4].value['fontColor'] = color;
            }
            self.setState({ rows: rows })
        }

        if (header || (type && type === 'ReadOnly')) {
            return <p style={{ color: '#888' }}>{value}</p>
        }

        if (type) {
            if (selected) {
                if (type === 'TextField') {
                    return <TextField
                        id={textFieldId}
                        onChange={onTextFieldChange}
                        style={textFieldStyle}
                        value={value}
                    />
                }
                if (type === 'DatePicker') {
                    return <DatePicker
                        id={datePickerId}
                        onChange={onDatePickerChange}
                        mode='landscape'
                        style={datePickerStyle}
                        value={value}
                    />
                }
                if (type === 'ColorPicker') {
                    return <ColorPicker id={colorPickerId} value={value} onChange={onColorPickerChange} />
                }
                if (type === 'Toggle') {
                    return <Toggle onToggle={onToggle} toggled={value} />
                }
                if (type === 'Chip') {
                    return <Chip style={{ margin: 4 }} backgroundColor={value.bgColor} labelColor={value.fontColor}>{value.text}</Chip>
                }
            } else {
                if (type === 'Toggle') {
                    return <Toggle disabled onToggle={onToggle} toggled={value} />
                }
                if (type === 'DatePicker') {
                    return <DatePicker
                        id={datePickerId}
                        onChange={onDatePickerChange}
                        mode='landscape'
                        style={datePickerStyle}
                        value={value}
                        disabled={Boolean(true)}
                    />
                }
                if (type === 'ColorPicker') {
                    return <ColorPicker disabled={true} value={value} id={colorPickerId} onChange={onColorPickerChange} />
                }
                if (type === 'Chip') {
                    return <Chip style={{ margin: 4 }} backgroundColor={value.bgColor} labelColor={value.fontColor}>{value.text}</Chip>
                }
            }
        }

        return <TextField
            id={textFieldId}
            style={textFieldStyle}
            disabled
            value={value}
        />
    };

    renderHeader = () => {
        const headerColumns = this.props.headerColumns
        const columns = headerColumns.map((column, id) => {
            return { value: column.value }
        })
        const row = { columns: columns, header: true }

        return this.renderRow(row);
    };



    renderRow = (row: any) => {
        const self = this;
        const columns = row.columns;
        const rowStyle = {
            width: '100%',
            display: 'flex',
            flexFlow: 'row nowrap',
            padding: row.header ? 0 : 12,
            border: 0,
            borderBottom: '1px solid #ccc',
            height: 50,
            boxSizing: 'border-box',
            alignItems: 'center'
        };
        const checkboxStyle = {
            display: 'flex',
            flexFlow: 'row nowrap',
            width: 50,
            height: 24,
            alignItems: 'center'
        };

        let deleteButtonStyle = {
            display: 'flex',
            flexFlow: 'row nowrap',
            width: 50,
            height: 24,
            alignItems: 'center',
            padding: '0 12 0'
        };

        const rowId = row.id;
        const rowKey = ['row', rowId].join('-');

        const onRowClick = function (e: any) {
            var rows = self.state.rows;
            rows.forEach((row, i) => {
                if (rowId !== i) row.selected = false
            })
            rows[rowId].selected = !rows[rowId].selected
            self.setState({ rows: rows })
        }

        const r = self.state.rows[rowId]
        const selected = (r && r.selected) || false

        const button = selected ? <Check /> : <ModeEdit />
        const tooltip = selected ? 'Done' : 'Edit';

        const handleDelete = function(event: any){
            self.setState({
                popoverOpen: true,
                anchorEl: event.currentTarget
            });
        };

        const onDeleteRow = function (e: any) {
            let rows = self.state.rows
            let deleteEvent = {} as any;
            rows.forEach((row, i) => {
                if (rowId === i) {
                    rows.splice(i, 1);
                    deleteEvent = { id: row.primaryId, primaryId: row.primaryId, phantom: row.phantom };
                }
            })
            rows.forEach((row, i) => {
                row.id = i
            })
            self.setState({ rows: rows })
            if (deleteEvent.primaryId != undefined) {
                self.props.onDelete(deleteEvent)
            }
            handleCancelDel();
        }

        const handleCancelDel = function(){
            self.setState({
                popoverOpen: false
            });
        };

        const onClick = function (e: any) {
            if (selected) {
                self.update()
            }

            onRowClick(e)
        }

        const deleteButton = (!this.props.enableDelete || selected || row.header) ?
            <div style={deleteButtonStyle as any} />
            :
            <IconButton style={deleteButtonStyle as any} tooltip={'Delete this row'} onClick={handleDelete}>
                <Delete />
                <Popover
                    open={this.state.popoverOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                >
                    <Menu>
                        <MenuItem primaryText="确认" onClick={onDeleteRow}/>
                        <MenuItem primaryText="取消" onClick={handleCancelDel}/>
                    </Menu>
                </Popover>
            </IconButton>

        const checkbox = row.header ?
            <div style={checkboxStyle as any} />
            :
            <IconButton style={checkboxStyle as any} tooltip={tooltip} onClick={onClick}>
                {button}
            </IconButton>

        return (
            <div key={rowKey} className='row' style={rowStyle as any}>
                {checkbox}
                {columns.map((column: any, id: number) => {
                    const width = this.props.headerColumns.map((header) => {
                        return (header && header.width) || false
                    })[id]
                    const cellStyle = {
                        display: 'flex',
                        flexFlow: 'row nowrap',
                        flexGrow: 0.15,
                        flexBasis: 'content',
                        alignItems: 'center',
                        height: 30,
                        width: width || 200
                    }
                    const columnKey = ['column', id].join('-')
                    column.selected = selected
                    column.rowId = rowId
                    column.id = id
                    column.header = row.header
                    column.width = cellStyle.width
                    return (
                        <div key={columnKey} className='cell' style={cellStyle as any}>
                            <div>
                                {this.getCellValue(column)}
                            </div>
                        </div>
                    )
                })}
                {deleteButton}
            </div>
        )
    };

    formatRows = (headerColumns: Array<ColumnProps>, dataSource: Array<any>) => dataSource.map((data, index) => {
        let columns = headerColumns.map(column => {
            let value = data[column.dataIndex];
            if (column.dataIndex == 'labelStyle') {
                value = {
                    text: data['name'],
                    bgColor: data['bgColor'],
                    fontColor: data['fontColor']
                };
            }
            return { ...column, value: value };
        });
        return { columns: columns, phantom: false, primaryId: data.id || -(index + 1), selected: false };
    });


    componentWillMount() {
        let { headerColumns, dataSource } = this.props;
        this.setState({
            rows: this.formatRows(headerColumns, dataSource)
        });
    }

    componentWillReceiveProps(nextProps: EditTableProps) {
        let { headerColumns, dataSource } = nextProps;
        var rows = this.formatRows(headerColumns, dataSource);
        //判断是否有新增加的行，如果有增加到末尾行
        var oldRows = this.state.rows;
        var addRows = oldRows.slice(rows.length);
        if (addRows.length == 1) {
            rows.push(addRows[0]);
        }
        this.setState({
            rows
        });
    }

    render() {
        const self = this;
        const containerStyle = {
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Roboto, sans-serif'
        };

        const buttonStyle = {
            display: 'flex',
            flexFlow: 'row nowrap',
            marginTop: 10
        };

        const { rows } = self.state;
        const { headerColumns } = self.props;

        const onButtonClick = (e: any) => {
            const defaults = {
                'TextField': '',
                'Toggle': true,
                'DatePicker': {},
                'Chip': {
                    text: '',
                    bgColor: '',
                    fontColor: ''
                }
            };
            const newColumns = headerColumns.map((column, index) => {
                const value = defaults[column.type];
                return { ...column, value };
            });

            const updatedRows = rows.map((row) => {
                if (row.selected) {
                    self.update()
                    row.selected = false
                }
                return row
            })
            updatedRows.push({ columns: newColumns, selected: true, id: updatedRows.length, phantom: true, primaryId: -(updatedRows.length + 1) });
            self.setState({ rows: updatedRows })
        }

        return (
            <div className='container' style={containerStyle as any}>
                {this.renderHeader()}
                {rows.map((row, id) => {
                    row.id = id
                    return this.renderRow(row)
                })}
                <RaisedButton
                    onClick={onButtonClick}
                    style={buttonStyle}
                    label='新增'
                />
            </div>
        )
    }
}
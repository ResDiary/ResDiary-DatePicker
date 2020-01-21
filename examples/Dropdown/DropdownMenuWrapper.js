import React, {Fragment} from 'react'
import {Input, InputGroup, InputGroupAddon, DropdownMenu, DropdownItem} from 'reactstrap'

class DropdownMenuWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.getDropdownOptions = this.getDropdownOptions.bind(this);
        this.getFilteredOptions = this.getFilteredOptions.bind(this);
    }

    getDropdownEntry(option) {
        const isCurrentValue = this.props.selectedValue === option.value;
        return (
            <Fragment key={option.value}>
                <div onClick={(e) => e.stopPropagation()}><DropdownItem divider /></div>
                <div className="dropdown-item-wrapper">
                    <DropdownItem className={isCurrentValue ? "dropdown-item-selected" : ""} onClick={() => { if (!isCurrentValue) this.props.onValueChange(option.value);}}>
                        {option.text}
                    </DropdownItem>
                    {(isCurrentValue && this.props.hasDefaultValue && !this.props.hideRemoveItemIcon) && <Icon onClick={(e) => this.removeSelectedValue(e, option.value)} src={CloseIcon} />}
                </div>
            </Fragment>
        );
    }

    getDropdownOptions() {
        // Prioritise optionGroups if both those and options have been passed as props
        if (this.props.optionGroups) {
            return this.props.optionGroups.map((optionGroup, index) => {
                if (optionGroup.options.length > 0) {
                    return (
                        <Fragment key={index}>
                            <div onClick={(e) => e.stopPropagation()}><DropdownItem header>{optionGroup.label}</DropdownItem></div>
                            {this.getFilteredOptions(optionGroup.options)}
                        </Fragment>
                    );
                }
            });
        } else if (this.props.options) {
            return this.getFilteredOptions(this.props.options);
        } else {
            return null;
        }
    }

    getFilteredOptions(options) {
        // Filter results if required, if not just return the options as usual
        return (this.props.searchTerm !== "" && this.props.isSearchable) ?
            options.reduce((filtered, option) => {
                if (option.text.toLowerCase().indexOf(this.props.searchTerm) > -1) {
                    filtered.push(this.getDropdownEntry(option));
                }
                return filtered;
            }, []) : options.map((option) => this.getDropdownEntry(option));
    }

    removeSelectedValue(e, value) {
        // Prevent further event bubbling
        e.stopPropagation();
        this.props.onValueChange(value);
    }

    render() {
        // Include search bar in the dropdown menu or not
        const dropdownOptions = this.props.isSearchable ?
            [<InputGroup key={1}>
                <InputGroupAddon addonType="prepend">
                    <Icon src={SearchIcon} />
                </InputGroupAddon>
                <Input autoFocus type="text" onBlur={this.props.endEdit} onClick={(e) => { e.stopPropagation(); }}
                    placeholder={window.rd.commonReact.resources.typeToSearch} onChange={(e) => this.props.filterSearch(e.target.value)} />
             </InputGroup>] : [];
        dropdownOptions.push(this.getDropdownOptions());
        return (
            <DropdownMenu right flip={this.props.flip}>
                {dropdownOptions}
            </DropdownMenu>
        );
    }
}

DropdownMenuWrapper.defaultProps = {
    flip: true
};

export default DropdownMenuWrapper;
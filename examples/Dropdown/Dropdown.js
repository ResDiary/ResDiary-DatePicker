import React from 'react';
import { InputGroup, InputGroupButtonDropdown, Button, DropdownToggle, FormFeedback } from 'reactstrap';
import DropdownMenuWrapper from './DropdownMenuWrapper'
import '../../css/dropdown.scss'
import Icon from './Icon'

class Dropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isHovering: false,
            splitButtonOpen: false,
            searchTerm: ""
        };
        this.toggleSplit = this.toggleSplit.bind(this);
        this.filterSearch = this.filterSearch.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.isDropdownDisabled = this.isDropdownDisabled.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.hasLabelDefault = this.hasLabelDefault.bind(this);
        this.onMultiSelectRemoved = this.onMultiSelectRemoved.bind(this);
        this.getDropDownHeader = this.getDropDownHeader.bind(this);
    }

    filterSearch(searchTerm) {
        this.setState({ searchTerm: searchTerm.toLowerCase() });
    }

    getSelectedText() {
        const defaultValue = this.props.defaultValue ? this.props.defaultValue : "";
        let selectedOption;
        if (!this.props.selectedValue && this.props.selectedValue !== 0) {
            return defaultValue;
        } else if (this.props.optionGroups) {
            for (let optionGroup of this.props.optionGroups) {
                for (let option of optionGroup.options) {
                    if (option.value === this.props.selectedValue) {
                        selectedOption = option;
                    }
                }
            }
            return selectedOption ? selectedOption.text : defaultValue;
        } else if (this.props.options) {
            selectedOption = this.props.options.find(option => option.value === this.props.selectedValue);
            return selectedOption ? selectedOption.text : defaultValue;
        } else {
            // Given the unlikely case the dropdown has been passed no options whatsoever
            return defaultValue;
        }
    }

    getSelectedMultiValues() {
        const defaultValue = this.props.defaultValue ? this.props.defaultValue : "";
        return this.props.selectedValues && this.props.selectedValues.length > 0 ?
            this.props.selectedValues.map(selectedValue => {
                let selectedOption;
                if (this.props.optionGroups) {
                    for (let optionGroup of this.props.optionGroups) {
                        selectedOption = optionGroup.options.find(option => option.value === selectedValue);
                        if (selectedOption) {
                            break;
                        }
                    }
                } else if (this.props.options) {
                    selectedOption = this.props.options.find(option => option.value === selectedValue);
                }
                return selectedOption ? (
                    <div key={selectedOption.text} className="btn-dark flexbox">
                        {selectedOption.text}
                        <button type="button" className="close-button" onClick={(e) => { this.onMultiSelectRemoved(e, selectedOption.value); }} aria-label="Close">
                            <Icon src={"x"}/>
                        </button>
                    </div>
                ) : "";
            }) : <div className="multi-default-value">{defaultValue}</div>;
    }

    getUnselectedOptions() {
        return this.props.selectedValues ? this.props.options.filter(option => !this.props.selectedValues.includes(option.value)) : this.props.options;
    }

    isDropdownDisabled(unselectedOptions) {
        return this.props.isDropdownDisabled || (this.props.options && unselectedOptions.length === 0) ? true : false;
    }

    hasLabelDefault() {
        return this.props.displaySearchableText && !this.state.isHovering && !this.props.parentOverriding && !this.state.splitButtonOpen;
    }

    onMultiSelectRemoved(e, value) {
        // Prevent further event bubbling
        e.stopPropagation();
        this.props.onMultiSelectRemoved(value);
    }

    toggleSplit(e) {
        // Prevent further event bubbling
        e.stopPropagation();
        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen,
            searchTerm: ""
        });
    }

    onMouseOver() {
        this.setState({
            isHovering: true
        });
    }

    onMouseLeave() {
        this.setState({
            isHovering: false
        });
    }

    onValueChange(value) {
        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen,
            searchTerm: "",
            isHovering: false
        });
        // If the newly selected value matches the value currently selected, deselect the value
        value === this.props.selectedValue ? this.props.onValueChange(null) : this.props.onValueChange(value);
    }

    getDropDownHeader() {
        return (this.props.multiSelect || this.props.title) &&
            <div className={`${this.props.title ? "d-flex justify-content-between" : "d-flex justify-content-end"}`}>
                {this.props.title &&
                    <div className="d-flex justify-content-start">
                        <label>{this.props.title} </label>
                    </div>}
                {this.props.multiSelect &&
                    <div className={`${this.props.selectedValues && this.props.selectedValues.length > 0 ? "d-flex justify-content-end mb-1" : "hidden"}`}>
                        <a href="#" onClick={() => this.props.onClearSelectedValues()}>{window.rd.commonReact.resources.clearAll}</a>
                    </div>}
            </div>;
    }

    render() {
        const isLoading = this.props.isLoading ? this.props.isLoading : false;
        const unselectedOptions = this.getUnselectedOptions();
        const isDropdownDisabled = this.isDropdownDisabled(unselectedOptions);
        const dropDownClasses = [];
        if (this.props.inputGroupClassName) {
            dropDownClasses.push(this.props.inputGroupClassName);
        }

        return (
            <div className={this.hasLabelDefault() ? "rd-dropdown-text" : "rd-dropdown"} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
                {this.getDropDownHeader()}
                {(!isLoading &&
                    <InputGroup className={dropDownClasses.join(" ")}>
                        <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.splitButtonOpen} toggle={this.toggleSplit}>
                            {!this.props.multiSelect &&
                                <Button onClick={(e) => this.toggleSplit(e)} color="light" className="dropdown-btn-left text-left" disabled={isDropdownDisabled} onBlur={this.props.onBlur}>
                                    {this.getSelectedText()}
                                </Button>}
                            {this.props.multiSelect &&
                                <div onClick={!isDropdownDisabled ? (e) => this.toggleSplit(e) : null} className="dropdown-btn-left text-left d-flex multi-select-dropdown">
                                    {this.getSelectedMultiValues()}
                                </div>}
                            {this.props.customDropdownToggle ?
                                <DropdownToggle
                                    color="light"
                                    className={`dropdown-btn-right dropdown-custom-toggle ${this.props.multiSelect ? "multi" : ""}`}
                                    disabled={isDropdownDisabled}
                                >
                                    <Icon src={this.props.customDropdownIcon} />
                                </DropdownToggle> : <DropdownToggle color="light" className={`dropdown-btn-right ${this.props.multiSelect ? "multi" : ""}`} disabled={isDropdownDisabled} split />
                            }
                            <DropdownMenuWrapper
                                isSearchable={this.props.isSearchable}
                                hasDefaultValue={this.props.defaultValue}
                                filterSearch={this.filterSearch}
                                searchTerm={this.state.searchTerm}
                                selectedValue={this.props.selectedValue}
                                onValueChange={this.onValueChange}
                                options={!this.props.multiSelect ? this.props.options : unselectedOptions}
                                optionGroups={this.props.optionGroups}
                                flip={this.props.flip}
                                hideRemoveItemIcon={this.props.hideRemoveItemIcon}
                            />
                        </InputGroupButtonDropdown>
                    </InputGroup>)
                    || <div className="input-skeleton-height"> <Skeleton width={this.props.skeletonWidth} /></div>
                }
            </div>
        );
    }
}

export default Dropdown;
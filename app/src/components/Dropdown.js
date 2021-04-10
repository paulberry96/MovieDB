import React, { Component, createRef } from "react";
import "./Dropdown.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Fuse from "fuse.js";

class Dropdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: this.parseValue(this.props.value) || [],
			isOpen: false,
			searchVal: "",
			searchResults: []
		};

		this.dropdownRef = createRef();
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.handleDropdownClick = this.handleDropdownClick.bind(this);
		this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);

		if(this.props.searchable) {
			this.inputRef = createRef();
			this.fuse = new Fuse(this.props.options, {
				threshold: 0.4,
				keys: ['label']
			});
			this.handleSearchInput = this.handleSearchInput.bind(this);
		}
	}

	parseValue(value) {

		let options = [];

		if(typeof value === 'string') {
			options.push(this.props.options.find(o => o.value === value));
		}
		else if(!Array.isArray(value) && typeof value === 'object') {
			options.push(this.props.options.find(o => o.value === value.value));
		}
		else if(Array.isArray(value)) {
			options = value.map((v) => {
				if(typeof v === 'string')
					return this.props.options.find(o => o.value === v)
				else if(typeof v === 'object')
					return this.props.options.find(o => o.value === v.value);
			});
		}

		options = options.filter((v) => {
			return v !== undefined && v !== null;
		});

		return (options.length > 0) ? options : null;
	}

	handleDropdownClick() {
		if(this.state.isOpen) {
			if(this.state.searchVal === "") {
				if(this.props.searchable)
					this.inputRef.current.blur();
				this.setState({ isOpen: false });
			}
		}
		else {
			if(this.props.searchable)
				this.inputRef.current.focus();
			this.setState({ isOpen: true, searchVal: "" }, () => {
				if(this.props.onDropdown) {
					this.props.onDropdown(this.dropdownRef.current);
				}
			});
		}
	}

	setValue(value) {

		let selected = this.state.selected;
		const newValue = this.parseValue(value)[0];

		if(this.props.multi) {
			const index = selected.findIndex(s => s.value === newValue.value);
			if(index > -1)
				selected.splice(index, 1);
			else
				selected.push(newValue);
		}
		else {
			selected = [newValue];
		}

		if(selected.length === 0 && this.props.defaultValue)
			selected = this.parseValue(this.props.defaultValue);

		const isOpen = this.props.multi ? this.state.isOpen : false;

		this.setState({ selected: selected, isOpen: isOpen });

		if(isOpen && this.props.searchable)
			this.inputRef.current.focus();

		if(this.props.onChange)
			this.props.onChange(selected);
	}

	handleDocumentClick(e) {
		if(!this.dropdownRef.current.contains(e.target) && this.state.isOpen) {
			this.setState({ isOpen: false });
		}
	}

	handleDocumentKeyDown(e) {
		// Escape
		if(e.keyCode === 27) {
			this.setState({ isOpen: false });
			if(this.props.searchable)
				this.inputRef.current.blur();
		}
	}

	handleSearchInput(e) {
		const val = e.target.value.trim();

		let searchResults = [];

		if(val !== "") {
			searchResults = this.fuse.search(val).map((v, i) => { return v.item.value; });
		}

		this.setState({ searchVal: val, searchResults: searchResults });
	}

	componentDidMount() {
		document.addEventListener('click', this.handleDocumentClick, false);
		document.addEventListener('touchend', this.handleDocumentClick, false);
		document.addEventListener('keydown', this.handleDocumentKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleDocumentClick, false);
		document.removeEventListener('touchend', this.handleDocumentClick, false);
		document.removeEventListener('keydown', this.handleDocumentKeyDown);
	}

	componentDidUpdate(prevProps) {
		if(JSON.stringify(prevProps.value) !== JSON.stringify(this.props.value)) {
			this.setState({ selected: this.parseValue(this.props.value) || [] });
		}
	}

	render() {
		const { isOpen, selected, searchVal, searchResults } = this.state;
		const { options, multi, searchable, showCount } = this.props;

		if(showCount) {
			options.sort((a, b) => {
				return (b.count - a.count);
			});
		}

		let inputValue;
		if(isOpen) {
			if(searchable) inputValue = searchVal;
			else if(multi && selected.length > 1) inputValue = `${selected.length} Selected..`;
			else inputValue = selected.length > 0 ? selected[0].label : "";
		}
		else {
			if(multi && selected.length > 1) inputValue = `${selected.length} Selected..`;
			else inputValue = selected.length > 0 ? selected[0].label : "";
		}

		const menuClassName = `dropdown-menu${(isOpen) ? " shown" : ""}` + (this.props.menuClassName ? ` ${this.props.menuClassName}` : "");

		return (
			<div className="dropdown" ref={this.dropdownRef}>
				<div className="dropdown-value" onClick={this.handleDropdownClick}>
					{(this.props.searchable) ?
						<input className="dropdown-input" ref={this.inputRef} value={inputValue} placeholder={this.props.placeholder || ""} onChange={this.handleSearchInput} />
						:
						<input className="dropdown-input" value={inputValue} placeholder={this.props.placeholder} readOnly />
					}
					<FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} className="icon" />
				</div>
				{ isOpen ?
					<div className={menuClassName}>
						{options.map((opt) => {
							const active = selected.find(s => s.value === opt.value) !== undefined;
							return (searchVal === "" || searchResults.indexOf(opt.value) > -1) ?
								<div key={opt.value} className={`dropdown-option${active ? " active" : ""}`} onClick={this.setValue.bind(this, opt.value)}>
									<span>{opt.label}</span>
									{showCount ?
										<span className="count">({opt.count})</span>
										: null
									}
								</div>
								: null
						})}
					</div>
					: null
				}
			</div>
		);
	}
}

export default Dropdown;
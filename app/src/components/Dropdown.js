import React, { Component, createRef } from "react";
import "./Dropdown.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Fuse from "fuse.js";

class Dropdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: this.parseValue(this.props.value),
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
				keys: [ 'label' ]
			});
			this.handleSearchInput = this.handleSearchInput.bind(this);
		}
	}

	parseValue(value) {
		let option;
		for(let i = 0; i < this.props.options.length; i++) {
			if(this.props.options[i].value === value)
				option = this.props.options[i];
		}
		return option;
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
			this.setState({ isOpen: true, searchVal: "" });
		}
	}

	setValue(value) {

		const selected = this.parseValue(value);

		this.setState({ selected: selected, isOpen: false });

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
			// searchResults = this.fuse.search(val);
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

	render() {
		const { isOpen, selected, searchVal, searchResults } = this.state;
		const options = this.props.options;

		const inputValue = isOpen ? searchVal : selected.label;

		return (
			<div className="dropdown" ref={this.dropdownRef}>
				<div className="dropdown-value" onClick={this.handleDropdownClick}>
					{(this.props.searchable) ?
						<input className="dropdown-input" ref={this.inputRef} value={inputValue} placeholder={this.props.placeholder || ""} onChange={this.handleSearchInput} />
						:
						<span className="dropdown-input"> {selected.label} </span>
					}
					<FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} className="icon" />
				</div>
				{ isOpen ?
					<div className={`dropdown-menu${(isOpen) ? " shown" : ""}`}>
						{options.map((opt) => {
							return (searchVal === "" || searchResults.indexOf(opt.value) > -1) ?
								<div key={opt.value} className={`dropdown-option${(opt.value === selected.value) ? " active" : ""}`} onClick={this.setValue.bind(this, opt.value)}>
									{opt.label}
								</div>
								: null;
						})}
					</div>
					: null
				}
			</div>
		);
	}
}

export default Dropdown;
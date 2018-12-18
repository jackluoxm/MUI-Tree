var accordion = {
			n: 0,
			colors: ['#007AFF', '#1E8AFF', '#448FFF', '#77ADFF', '#88B8FF', '#99C2FF', '#BBD6FF', '#81BEF7',
				'#EEF5FF',
				'#A1A1A1', '#8B3E2F', '#303030', '#228B22', '#20B2AA', '#473C8B', '#388E8E', '#707070', '#848484', '#8B668B'
			],
			init: function(options) {
				if (this.n !== 0) {
					this.n = 0;
				}

				this.handleSelectArea = options.handleSelectArea;
				if (options.colors) {
					this.colors = options.colors;
				}
				if (options.elementID && options.data) {
					this.loadAccordionList(options);
				}
			},
			loadAccordionList: function(options) {
				var a = document.getElementById(options.elementID);
				var b = document.createElement('ul');
				b = this.getChildrenLi(b, options.data, this.colors[0], null, null, options)
				a.appendChild(b);
			},
			hideChildren: function(i, li, allLis) {
				var p = false;
				var theID = li.id;
				for (var j = i + 1; j < allLis.length; j++) {
					var nli = allLis[j];
					var parentID = nli.getAttribute('parentID');
					if (parentID == theID) {
						nli.className = 'fold';
						p = true;
						this.hideChildren(j, nli, allLis);
					}
				}
				if (p) {
					// li.childNodes[0].childNodes[1].innerText = '∨';
					li.childNodes[0].childNodes[1].className = 'parentSymbol';
				}
			},
			showList: function(obj, id) {
				var allLis = obj.parentNode.parentNode.parentNode.childNodes;
				for (var i = 0; i < allLis.length; i++) {
					if (allLis[i].id != id) {
						var li = allLis[i];
						var parentID = li.getAttribute('parentID');
						if (parentID == id) {
							var c = li.className;
							li.className = c === 'fold' ? 'unFold' : 'fold';
							this.hideChildren(i, li, allLis);
						}
					}
				}
				obj.parentNode.parentNode.className = 'unFold';
				// obj.innerText = obj.innerText === '∨' ? '∧' : '∨';
				obj.className = obj.className === 'parentActivedSymbol' ? 'parentSymbol' : 'parentActivedSymbol';
			},
			handleSelectArea: function(obj, areaID, name, color, elementID, showElementId, treeDataName, setAccordionFunc) {},
			getAccordionLi: function(data, color, parentID, options) {
				var _this = this;
				for (var j = 0; j < this.colors.length; j++) {
					var c = this.colors[j];
					if (color.toLowerCase() == c.toLowerCase()) {
						break;
					}
				}
				var c, d, f, nameSpan;
				c = document.createElement('li');
				d = document.createElement('div');
				f = document.createTextNode(data.name);
				nameSpan = document.createElement('span');
				nameSpan.className='nameSpan';
				nameSpan.appendChild(f);
				c.id = data.id;
				if (color) {
					c.style.backgroundColor = color;
				}
				if (parentID) {
					c.setAttribute('parentID', parentID);
					c.className = 'fold';
				}
				nameSpan.addEventListener('tap', function(mouseEvent) {
					_this.handleSelectArea(mouseEvent.target, data.id, data.name, String(color), options);
				});
				d.appendChild(nameSpan);
				var parent = data.children && data.children.length;
				if (parent) {
					var s = document.createElement('span');
					// var aa = this;
					s.addEventListener('tap', function(mouseEvent) {
						_this.showList(mouseEvent.target, data.id);
					});
					s.className = 'parentSymbol';
					d.appendChild(s);
				}
				c.appendChild(d);
				return c;
			},
			isParent: function(ul, data, col, parentID, options) {
				var c = this.getAccordionLi(data, col, parentID, options);
				ul.appendChild(c);
				var p = data.children && data.children.length;
				return p;
			},

			colorRGB2Hex: function(color) {
				var rgb = color.split(',');
				var r = parseInt(rgb[0].split('(')[1]);
				var g = parseInt(rgb[1]);
				var b = parseInt(rgb[2].split(')')[0]);
				var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
				return hex;
			},
			getChildrenLi: function(ul, data, col, m, parentID, options) {
				var p = this.isParent(ul, data, col, parentID, options);
				if (p) {
					if (m) {
						if (m - this.n == 1) {
							this.n++;
						}
						var colStr1 = this.colors[m];
					} else {
						this.n++;
						var colStr1 = this.colors[this.n];
					}
					for (var i = 0; i < data.children.length; i++) {
						p = this.isParent(ul, data.children[i], colStr1, data.id, options);
						if (p) {
							if (i > 0) {
								var lastLi;
								for (var g = 0; g < ul.childNodes.length; g++) {
									var id = ul.childNodes[g].id;
									if (id == data.children[i - 1].id) {
										lastLi = ul.childNodes[g];
										break;
									}
								}
								var lastColorValue = this.colorRGB2Hex(lastLi.style.backgroundColor);
								if (lastColorValue.toLowerCase() !== this.colors[this.n].toLowerCase()) {
									for (var j = 0; j < this.colors.length; j++) {
										var color = this.colors[j];
										if (color.toLowerCase() === lastColorValue.toLowerCase()) {
											this.n = j;
											break;
										}
									}
								}
							}
							if ((m && m == this.n) || (!m)) {
								this.n++;
							}
							var colStr2 = this.colors[this.n];
							var t = this.n + 1;
							for (var j = 0; j < data.children[i].children.length; j++) {
								this.getChildrenLi(ul, data.children[i].children[j], colStr2, t, data.children[i].id, options);
							}
						}
					}
				}
				return ul;
			}
		};

let slideUp = (target, duration = 400) => {
   if (!target.classList.contains('-anim')) {
      target.classList.add('-anim');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('-anim');
      }, duration)
   }
}
let slideDown = (target, duration = 400) => {
   if (!target.classList.contains('-anim')) {
      target.classList.add('-anim');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('-anim');
      }, duration)
   }
}
let slideToggle = (target, duration = 400) => {
   if (target.hidden) {
      return slideDown(target, duration);
   } else {
      return slideUp(target, duration);
   }
}
class Spoller {
   init() {
      this.elements = document.querySelectorAll('[data-spollers]')
      this.objects = []
      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const spoller = this.elements[index];
            const obj = {}
            obj.el = spoller
            obj.oneSpoller = obj.el.hasAttribute('data-one-spoller')
            obj.items = obj.el.querySelectorAll('[data-spoller-item]')
            const mediaSettings = obj.el.dataset.spollers.split(',').map(item => item.trim())
            obj.mediaSettings = {
               type: mediaSettings[0],
               size: mediaSettings[1],
            }
            obj.activeItems = Array.from(obj.items).filter(item => item.classList.contains('-active'))
            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            const mediaQueryList = window.matchMedia(`(${obj.mediaSettings.type}-width:${obj.mediaSettings.size}px)`)

            this.mediaHandler(mediaQueryList, obj.el, obj.items, obj.activeItems, obj.oneSpoller)
            mediaQueryList.addEventListener('change', e => this.mediaHandler(e, obj.el, obj.items, obj.activeItems, obj.oneSpoller))
         }
      }
   }
   mediaHandler(e, spollerElement, items, activeItems, oneSpoller) {
      if (e.matches) {
         const activeItems = []
         const inactiveItems = []
         items.forEach(item => item.classList.contains('-active') ? activeItems.push(item) : inactiveItems.push(item))

         if (activeItems.length > 0) {
            if (oneSpoller) {
               if (activeItems.length > 1) {
                  slideDown(items[0].nextElementSibling, 0)
                  activeItems.forEach(item => {
                     item.classList.remove('-active')
                     if (item.hasAttribute('data-spoller-item-next')) {
                        slideUp(item.nextElementSibling.nextElementSibling, 0)
                     } else {
                        slideUp(item.nextElementSibling, 0)
                     }
                  })
                  items[0].classList.add('-active')
               } else if (activeItems.length == 1) {
                  slideDown(activeItems[0].nextElementSibling, 0)
               }
            } else {
               activeItems.forEach(item => {
                  slideDown(item.nextElementSibling, 0)
               })
            }
         } else {
            if (oneSpoller) {
               items[0].classList.add('-active')
               slideDown(items[0].nextElementSibling, 0)
            }
         }
         if (inactiveItems.length > 0) {
            inactiveItems.forEach(item => {
               if (item.hasAttribute('data-spoller-item-next')) {
                  slideUp(item.nextElementSibling.nextElementSibling, 0)
               } else {
                  slideUp(item.nextElementSibling, 0)
               }
            })
         }

         spollerElement.items = items
         spollerElement.oneSpoller = oneSpoller
         spollerElement.addEventListener('click', this.actionSpollerElement)
      } else {
         items.forEach(item => {
            item.classList.remove('-active')
            slideDown(item.nextElementSibling, 0)
         })
         if (activeItems.length > 0) {
            activeItems.forEach(item => item.classList.add('-active'))
         }

         if (spollerElement.items && spollerElement.oneSpoller) {
            delete spollerElement.items
            delete spollerElement.oneSpoller
         }
         spollerElement.removeEventListener('click', this.actionSpollerElement)
      }
   }
   actionSpollerElement(e) {
      const target = e.target;
      const items = e.currentTarget.items;
      const oneSpoller = e.currentTarget.oneSpoller;
      const animContent = Array.from(items).filter(item => item.nextElementSibling.classList.contains('-anim'))

      if (target.closest('[data-spoller-item]')) {
         const item = target.closest('[data-spoller-item]')
         if (!item.querySelector('[data-spoller-openner]') || target.closest('[data-spoller-openner]')) {
            e.preventDefault()
            if (animContent.length === 0) {
               if (item.classList.contains('-active')) {
                  if (!oneSpoller) {
                     item.classList.remove('-active')
                     slideUp(item.nextElementSibling)
                  }
               } else {
                  slideDown(item.nextElementSibling)
                  if (oneSpoller) {
                     items.forEach(item => {
                        item.classList.remove('-active')
                        slideUp(item.nextElementSibling)
                     })
                  }
                  item.classList.add('-active')
               }
            }
         }
      }
   }
}
const spoller = new Spoller()
spoller.init()
class Me {
   constructor(type) {
      this.typeMedia = type
   }
   init() {
      this.elements = document.querySelectorAll('[data-me]')
      this.objects = []

      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const meElement = this.elements[index];

            const obj = {}
            obj.el = meElement
            const dataAttr = meElement.dataset.me.split(',').map(item => item.trim())
            obj.dataAttr = {
               size: dataAttr[0],
               block: dataAttr[1],
               index: dataAttr[2],
            }
            obj.parentElement = obj.el.parentElement
            obj.indexParent = Array.from(obj.parentElement.children).indexOf(obj.el)
            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            const mediaQueryList = window.matchMedia(`(${this.typeMedia}-width:${obj.dataAttr.size}px)`)
            this.mediaHandler(mediaQueryList, obj)
            mediaQueryList.addEventListener('change', e => this.mediaHandler(e, obj))
         }
      }
   }
   mediaHandler(e, obj) {
      if (e.matches) {
         obj.el.classList.add('-me')
         this.moveTo(obj.el, obj.dataAttr.block, obj.dataAttr.index)
      } else {
         obj.el.classList.remove('-me')
         this.moveBack(obj.el, obj.parentElement, obj.indexParent)
      }
   }
   moveTo(element, block, index) {
      if (document.querySelector(block)) {
         const toBlock = document.querySelector(block)
         const blockChildren = toBlock.children
         const indexBlock = index == 'first' ? 0 :
            index == 'last' ? undefined :
               index;

         if (blockChildren[indexBlock] != undefined) {
            blockChildren[indexBlock].insertAdjacentElement(
               'beforebegin',
               element
            )
         } else {
            toBlock.insertAdjacentElement(
               'beforeend',
               element
            )
         }
      }
   }
   moveBack(element, parentElement, index) {
      const blockChildren = parentElement.children

      if (blockChildren[index] != undefined) {
         blockChildren[index].insertAdjacentElement(
            'beforebegin',
            element
         )
      } else {
         parentElement.insertAdjacentElement(
            'beforeend',
            element
         )
      }
   }
}
const me = new Me('max')
me.init()
class Tabs {
   init() {
      this.elements = document.querySelectorAll('[data-tab]')
      this.objects = []
      if (this.elements.length > 0) {
         for (let index = 0; index < this.elements.length; index++) {
            const tab = this.elements[index];
            const obj = {}
            obj.el = tab
            if (obj.el.children[0].children[0]) {
               if (obj.el.children[0].children[0].hasAttribute('data-tab-item')) {
                  obj.items = Array.from(obj.el.children[0].children)
               } else if (obj.el.children[0].children[0].children[0].hasAttribute('data-tab-subitem')) {
                  obj.items = Array.from(obj.el.children[0].children[0].children)
               } else if (obj.el.children[0].children[0].children[0].hasAttribute('data-tab-item')) {
                  obj.items = Array.from(obj.el.children[0].children[0].children)
               }
            }

            obj.contents = Array.from(obj.el.children[1].children)
            obj.activeItems = Array.from(obj.items).filter(item => item.classList.contains('-active'))
            obj.itemLabel = obj.el.hasAttribute('data-tab-item-label')

            const mediaSettings = obj.el.dataset.tab.split(',').map(item => item.trim())
            obj.mediaSettings = {
               type: mediaSettings[0],
               size: mediaSettings[1],
            }
            this.objects.push(obj)
         }
         for (let index = 0; index < this.objects.length; index++) {
            const obj = this.objects[index];
            const mediaQueryList = window.matchMedia(`(${obj.mediaSettings.type}-width:${obj.mediaSettings.size}px)`)
            this.mediaHandler(mediaQueryList, obj.el, obj.items, obj.contents, obj.activeItems, obj.itemLabel, obj)
            mediaQueryList.addEventListener('change', e => this.mediaHandler(e, obj.el, obj.items, obj.contents, obj.activeItems, obj.itemLabel, obj))
         }
      }
   }
   mediaHandler(e, tabElement, items, contents, activeItems, itemLabel, obj) {
      if (e.matches) {
         let activeItems = []
         const inactiveItems = []
         items.forEach(item => item.classList.contains('-active') ? activeItems.push(item) : inactiveItems.push(item))
         if (activeItems.length > 0) {
            if (activeItems.length > 1) {
               items.forEach(item => item.classList.remove('-active'))
               items[0].classList.add('-active')
               activeItems = [items[0]]
               if (itemLabel) {
                  slideDown(activeItems[0].nextElementSibling, 0)
               }
            }
            if (itemLabel) {
               activeItems.forEach(item => slideDown(item.nextElementSibling, 0))
               items.forEach(item => {
                  if (item.hasAttribute('data-spoller-item-next')) {
                     slideUp(item.nextElementSibling.nextElementSibling, 0)
                  } else {
                     slideUp(item.nextElementSibling, 0)
                  }
               })
            }
         } else {
            items[0].classList.add('-active')
            activeItems = [items[0]]
            if (itemLabel) {
               activeItems.forEach(item => slideDown(item.nextElementSibling, 0))
               items.forEach(item => {
                  if (item.hasAttribute('data-spoller-item-next')) {
                     slideUp(item.nextElementSibling.nextElementSibling, 0)
                  } else {
                     slideUp(item.nextElementSibling, 0)
                  }
               })
            }
         }
         const activeContent = []
         const inactiveContent = []
         if (activeItems[0].dataset.tabItem) {
            contents.forEach(content => content.dataset.tabContent == activeItems[0].dataset.tabItem ? activeContent.push(content) : inactiveContent.push(content))
         } else if (activeItems[0].dataset.tabSubitem) {
            contents.forEach(content => content.dataset.tabContent == activeItems[0].dataset.tabSubitem ? activeContent.push(content) : inactiveContent.push(content))
         }

         activeContent[0].classList.add('-active')
         this.animShow(activeContent[0], false)

         inactiveContent.forEach(content => {
            if (content.classList.contains('-active')) {
               content.classList.remove('-active')
            }
            this.animHide(content, false)
         })

         tabElement.contents = contents
         tabElement.thisCLass = this
         tabElement.items = items
         tabElement.itemLabel = itemLabel
         tabElement.addEventListener('click', this.actionTabElement)
      } else {
         items.forEach(item => {
            item.classList.remove('-active')
            if (itemLabel) {
               items.forEach(item => {
                  slideDown(item.nextElementSibling, 0)
               })
            }
         })
         contents.forEach(content => {
            content.classList.remove('-active')
            this.animShow(content, false, true)
         })
         if (activeItems) {
            activeItems.forEach(item => item.classList.add('-active'))
         }

         tabElement.removeEventListener('click', this.actionTabElement)
      }
   }
   actionTabElement(e) {
      const target = e.target
      const contents = e.currentTarget.contents
      const thisCLass = e.currentTarget.thisCLass
      const itemLabel = e.currentTarget.itemLabel

      if (target.closest('[data-tab-item]') || target.closest('[data-tab-subitem]') && target.closest('.-parent-tab-item')) {
         e.preventDefault()
         let animContents;
         let contentsElement;

         const items = target.closest('.-parent-tab-item').children

         if (target.closest('[data-tab-item]')) {
            contentsElement = target.closest('[data-tab-item]').closest('[data-tab-items]').nextElementSibling.children
         } else if (target.closest('[data-tab-subitem]')) {
            contentsElement = target.closest('[data-tab-subitem]').closest('[data-tab-items]').nextElementSibling.children
         }

         animContents = Array.from(contentsElement).filter(content => content.classList.contains('-anim'))
         if (animContents.length === 0) {
            let item;
            if (target.closest('[data-tab-item]')) {
               item = target.closest('[data-tab-item]')
            } else if (target.closest('[data-tab-subitem]')) {
               item = target.closest('[data-tab-subitem]')
            }

            if (!item.classList.contains('-active')) {
               let activeContent = [];
               const inactiveContent = []
               if (item.dataset.tabItem) {
                  contents.forEach(content => content.dataset.tabContent == item.dataset.tabItem ? activeContent.push(content) : inactiveContent.push(content))
               } else if (item.dataset.tabSubitem) {
                  contents.forEach(content => content.dataset.tabContent == item.dataset.tabSubitem ? activeContent.push(content) : inactiveContent.push(content))
               }
               Array.from(items).forEach(item => item.classList.remove('-active'))
               item.classList.add('-active')

               activeContent[0].classList.add('-active')

               thisCLass.animShow(activeContent[0])
               inactiveContent.forEach(content => {
                  thisCLass.animHide(content)
                  content.classList.remove('-active')
               })
               setTimeout(() => {
                  ssb.refresh()
               }, 150)
               if (itemLabel) {
                  slideDown(item.nextElementSibling)
                  items.forEach(item => {
                     slideUp(item.nextElementSibling)
                  })
               }
            }
         }
      }
   }
   animHide(el, anim = true) {
      if (anim) {
         el.style.opacity = '0.5'
         el.classList.add('-anim')
         setTimeout(() => {
            el.style.display = 'none'
            el.classList.remove('-anim')
         }, 150)
      } else {
         el.style.opacity = '0.5'
         el.style.display = 'none'
      }
   }
   animShow(el, anim = true, removeStyle = false) {
      if (anim) {
         setTimeout(() => {
            el.style.display = 'block'
            el.classList.add('-anim')
            setTimeout(() => {
               el.style.opacity = '1'
               el.classList.remove('-anim')
            }, 100)
         }, 150)
      } else {
         el.style.opacity = '1'
         el.style.display = 'block'
      }
      if (removeStyle) {
         el.style.removeProperty('opacity')
         el.style.removeProperty('display')
      }
   }
}
const tabs = new Tabs()
tabs.init()
class ValidateForm {
   constructor(form, objUser) {
      this.form = form
      this.objUser = objUser
      form.addEventListener('submit', e => this.formSend(e, this, form, objUser))
   }
   async formSend(e, thisClass, form, objUser) {
      e.preventDefault()
      const error = thisClass.validateForm(form, objUser)

      if (error === 0) {
         form.classList.add('-sending')
         const formData = new FormData(form)

         const response = await fetch(objUser.url, {
            method: objUser.method,
            // body: formData
         })
         if (response.ok) {
            // const result = await response.json();
            console.log('result');
         } else {
            console.log('Error');
         }

         form.reset()
         if (objUser.items.input && objUser.items.input.length > 0) {
            objUser.items.input.forEach(input => {
               input.blur()
            })
         }
         if (form.querySelectorAll('.-custom-select')) {
            const customSelect = form.querySelectorAll('.-custom-select')
            customSelect.forEach(select => select.reset())
         }
         form.classList.remove('-sending')
      } else {
         console.log('Emptly');
      }
   }
   validateForm(form, objUser) {
      let error = 0;
      for (const prop in objUser.items) {
         const elements = objUser.items[prop]

         if (prop == 'input') {
            if (elements.length > 0) {
               elements.forEach(input => {
                  this.removeError(input)

                  if (input.classList.contains('-tel')) {
                     if (this.telTest(input)) {
                        this.addError(input)
                        error++
                     }
                  } else if (input.classList.contains('-email')) {
                     if (this.emailTest(input)) {
                        this.addError(input)
                        error++
                     }
                  } else if (input.classList.contains('-password')) {
                     if (input.value.length < 8 || input.value.length > 10) {
                        this.addError(input)
                        error++
                        if (input.value.length < 8) {
                           console.log('passswod 8');
                        }
                        if (input.value.length > 10) {
                           console.log('passswod 10');
                        }
                     }
                  } else {
                     if (!input.value) {
                        this.addError(input)
                        error++
                     }
                  }
               })
            }
         }
         if (prop == 'checkbox') {
            if (elements.length > 0) {
               elements.forEach(checkbox => {
                  this.removeError(checkbox)
                  if (!checkbox.checked) {
                     this.addError(checkbox)
                     error++
                  }
               })
            }
         }
         if (prop == 'radio') {
            if (elements.length > 0) {
               const groupsRadio = {}
               elements.forEach(radio => {
                  if (!groupsRadio[radio.name]) {
                     groupsRadio[radio.name] = []
                  }
                  groupsRadio[radio.name].push(radio)
               })
               for (const prop in groupsRadio) {
                  const groupRadio = groupsRadio[prop]
                  const checkedRadio = Array.from(groupRadio).filter(radio => radio.checked)[0]

                  groupRadio.forEach(radio => {
                     this.removeError(radio)
                  })
                  if (!checkedRadio) {
                     groupRadio.forEach(radio => {
                        this.addError(radio)
                        error++
                     })
                  }
               }
            }
         }
         if (prop == 'select') {
            if (elements.length > 0) {
               elements.forEach(select => {
                  select.classList.remove('-error')
                  if (select.classList.contains('-custom-select-no-choose')) {
                     select.classList.add('-error')
                     error++
                  }
               })
            }
         }
      }
      return error;
   }
   removeError(input) {
      input.parentElement.classList.remove('-error')
      input.classList.remove('-error')
      const form = input.closest('form')
      if (form.classList.contains('-error')) {
         form.classList.remove('-error')
      }
   }
   addError(input) {
      input.parentElement.classList.add('-error')
      input.classList.add('-error')
      const form = input.closest('form')
      if (!form.classList.contains('-error')) {
         form.classList.add('-error')
      }
   }
   emailTest(input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
   }
   telTest(input) {
      return !/^((8|\+7)[\- ]?)?(\(?\d{3,4}\)?[\- ]?)?[\d\- ]{5,10}$/.test(input.value);
   }
}

const inputsValue = document.querySelectorAll('[data-value]')
if (inputsValue.length > 0) {
   inputsValue.forEach(input => {
      const placeholderValue = input.dataset.value;

      if (!input.value) {
         input.placeholder = placeholderValue
      }

      input.addEventListener('focus', () => {
         input.placeholder = ''
      })
      input.addEventListener('blur', () => {
         input.placeholder = placeholderValue
      })
   })
}
class LoadMore {
   constructor(objUser) {
      const loadMoreBtn = document.querySelector(objUser.el)
      if (loadMoreBtn) {
         loadMoreBtn.addEventListener('click', e => {
            e.preventDefault()
            if (!loadMoreBtn.classList.contains('-hold') && !loadMoreBtn.classList.contains('-close')) {
               loadMoreBtn.classList.add('-hold')
               this.loadMore(objUser, loadMoreBtn)
            }
         })
      }
   }
   async loadMore(objUser, loadMoreBtn) {
      const response = await fetch(objUser.url, {
         method: 'GET'
      })
      if (response.ok) {
         const data = await response[objUser.method]()
         setTimeout(() => {
            objUser.afterGet(data, loadMoreBtn)
         }, 700)
      }
   }
}
class Popup {
   init() {
      this.elements = document.querySelectorAll('[data-popup-link]')
      this.objects = []
      if (this.elements.length > 0) {
         document.addEventListener('click', e => this.actionPopupDocument(e, this))
      }
   }
   actionPopupDocument(e, thisClass) {
      const target = e.target
      const animPopup = document.querySelectorAll('[data-popup].-anim')

      if (target.closest('[data-popup-link]')) {
         e.preventDefault()

         if (animPopup.length === 0) {
            const popupLink = target.closest('[data-popup-link]')

            const openPopups = document.querySelectorAll('[data-popup].-open')
            openPopups.forEach(element => element.classList.remove('-open'))

            if (document.querySelector(`${popupLink.dataset.popupLink}`)) {
               const popupBlock = document.querySelector(`${popupLink.dataset.popupLink}`)
               if (openPopups.length > 0) {
                  thisClass.openPopup(popupBlock, false)
               } else {
                  thisClass.openPopup(popupBlock)
               }
            }
         }
      }
      if (target.closest('[data-popup-close]')) {
         e.preventDefault()
         if (animPopup.length === 0) {
            const popupClose = target.closest('[data-popup-close]')
            const popupBlock = popupClose.closest('[data-popup]')
            thisClass.closePopup(popupBlock)
         }
      }
      if (target.closest('[data-popup]') && !target.closest('[data-popup-content]')) {
         if (animPopup.length === 0) {
            const popupBlock = target.closest('[data-popup]')
            thisClass.closePopup(popupBlock)
         }
      }
   }
   openPopup(el, anim = true) {
      el.classList.add('-open')
      el.classList.add('-anim')
      setTimeout(() => {
         el.classList.remove('-anim')
      }, 400)
      if (anim) {
         this.actionPadding()
         document.body.classList.add('-lock-popup')
      }
   }
   closePopup(el) {
      el.classList.add('-anim')
      el.classList.remove('-open')
      setTimeout(() => {
         this.actionPadding(false)
         document.body.classList.remove('-lock-popup')
         el.classList.remove('-anim')
      }, 400)
   }
   actionPadding(addPadding = true) {
      const arrPaddingElements = []
      arrPaddingElements.push(document.body)
      
      const paddingElements = document.querySelectorAll('.-popup-padding')
      if (paddingElements.length > 0) {
         paddingElements.forEach(el => arrPaddingElements.push(el))
      }
      if (addPadding) {
         const widthScrollBar = window.innerWidth - document.querySelector('.wrapper').offsetWidth;
         arrPaddingElements.forEach(element => {
            element.style.paddingRight = widthScrollBar + 'px'
         })
      } else {
         arrPaddingElements.forEach(element => {
            element.style.paddingRight = ''
         })
      }
   }
}
const popup = new Popup()
popup.init()
const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i); },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
   any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

const mqlMax = window.matchMedia('(max-width: 767.98px)')
let ssb = {
   aConts: [],
   mouseY: 0,
   N: 0,
   asd: 0, /*active scrollbar element*/
   sc: 0,
   sp: 0,
   to: 0,

   // constructor
   scrollbar: function (el) {
      // perform initialization
      if (!ssb.init()) return false;

      // adding new container into array
      ssb.aConts[ssb.N++] = el;

      el.insertAdjacentHTML(
         'afterbegin',
         '<div data-scroll-wrap></div>'
      )
      const customScrollWrap = el.querySelector('[data-scroll-wrap]')
      const customScrollContent = el.querySelector('[data-scroll-content]')
      customScrollWrap.insertAdjacentElement(
         'afterbegin',
         customScrollContent
      )

      customScrollWrap.insertAdjacentHTML(
         'afterend',
         `<div data-scroll-scrollbar-arrow data-scroll-scrollbar-arrow-up class="-arrow-slider"><span class="-icon-arrow-right"></span></div>
         <div data-scroll-scrollbar-arrow data-scroll-scrollbar-arrow-down class="-arrow-slider"><span class="-icon-arrow-right"></span></div>
         <div data-scroll-scrollbar>
            <div data-scroll-scrollbar-overlay></div>
            <div data-scroll-scrollbar-scroller></div>
         </div>`
      )
      customScrollWrap.wrap = el.querySelector('[data-scroll-scrollbar]')
      customScrollWrap.st = el.querySelector('[data-scroll-scrollbar-overlay]')
      customScrollWrap.sb = el.querySelector('[data-scroll-scrollbar-scroller]')
      customScrollWrap.su = el.querySelector('[data-scroll-scrollbar-arrow-up]')
      customScrollWrap.sd = el.querySelector('[data-scroll-scrollbar-arrow-down]')
      customScrollWrap.contentElement = customScrollContent

      if (isMobile.any()) {
         customScrollWrap.wrap.style.display = 'none'
         customScrollWrap.su.style.display = 'none'
         customScrollWrap.sd.style.display = 'none'
         customScrollWrap.style.width = '100%'
         customScrollWrap.removeAttribute('data-scroll-hidden')
      } else {
         customScrollWrap.wrap.style.display = ''
         customScrollWrap.su.style.display = ''
         customScrollWrap.sd.style.display = ''
         customScrollWrap.setAttribute('data-scroll-hidden', '')
      }

      el = customScrollWrap
      el.sw = el.wrap.offsetWidth
      el.scrollerMargin = 2
      el.sg = false;

      el.style.paddingRight = `${el.sw}px`

      // on mouse down processing
      el.sb.onmousedown = function (e) {
         if (!el.sg) {
            if (!e) e = window.event;
            ssb.asd = el;
            el.yZ = e.screenY;
            el.sZ = el.scrollTop;
            el.sg = true;
         }
         return false;
      }
      // on mouse down on free track area - move our scroll element too
      el.st.onmousedown = function (e) {
         if (!e) e = window.event;
         ssb.asd = el;
         ssb.mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
         for (var o = el, y = 0; o != null; o = o.offsetParent) y += o.offsetTop;
         el.scrollTop = (ssb.mouseY - y - (el.ratio * el.offsetHeight / 2) - el.sw) / el.ratio;
         el.sb.onmousedown(e);
      }

      // onmousedown events
      el.su.onmousedown = el.su.ondblclick = function (e) { ssb.mousedown(el, -1, e); return false; }
      el.sd.onmousedown = el.sd.ondblclick = function (e) { ssb.mousedown(el, 1, e); return false; }

      //onmouseout events
      el.su.onmouseout = el.su.onmouseup = ssb.clear;
      el.sd.onmouseout = el.sd.onmouseup = ssb.clear;
      // onscroll - change positions of scroll element
      el.ssb_onscroll = function () {
         this.ratio = (this.offsetHeight - 2 * this.scrollerMargin) / this.scrollHeight;
         this.sb.style.top = `${Math.floor(this.scrollerMargin + this.scrollTop * this.ratio)}px`
      }

      // start scrolling
      el.ssb_onscroll();
      ssb.refresh();

      // binding own onscroll event
      el.onscroll = el.ssb_onscroll;
      return el;
   },

   // initialization
   init: function () {
      if (window.oper || (!window.addEventListener && !window.attachEvent)) { return false; }

      // temp inner function for event registration
      function addEvent(o, e, f) {
         if (window.addEventListener) { o.addEventListener(e, f, false); ssb.w3c = true; return true; }
         if (window.attachEvent) return o.attachEvent('on' + e, f);
         return false;
      }

      // binding events
      addEvent(window.document, 'mousemove', ssb.onmousemove);
      addEvent(window.document, 'mouseup', ssb.onmouseup);
      addEvent(window, 'resize', ssb.refresh);
      return true;
   },

   // create and append div finc
   create_div: function (c, el, cont_clone) {
      let o = document.createElement('div');
      o.el = el;
      o.className = c;
      cont_clone.appendChild(o);
      return o;
   },
   // // do clear of controls
   clear: function () {
      clearTimeout(ssb.to);
      ssb.sc = 0;
      return false;
   },
   // refresh scrollbar
   refresh: function () {
      for (let i = 0, N = ssb.N; i < N; i++) {
         let o = ssb.aConts[i].querySelector('[data-scroll-wrap]');
         o.ssb_onscroll();
         o.sb.style.height = `${Math.ceil(Math.max(o.sw * .5, o.ratio * o.offsetHeight))}px`

         o.sw = o.wrap.offsetWidth
         o.style.paddingRight = `${o.sw}px`
         // o.style.paddingRight = `${el.sw}px`
         if (o.contentElement.offsetHeight < o.offsetHeight) {
            o.wrap.style.display = 'none'
            o.style.paddingRight = '0px'
         }
      }
   },
   // // arrow scrolling
   arrow_scroll: function () {
      if (ssb.sc != 0) {
         ssb.asd.scrollTop += 6 * ssb.sc / ssb.asd.ratio;
         ssb.to = setTimeout(ssb.arrow_scroll, ssb.sp);
         ssb.sp = 32;
      }
   },

   /* event binded functions : */
   // scroll on mouse down
   mousedown: function (el, s, e) {
      if (ssb.sc == 0) {
         const arrowNext = e.target.closest('[data-scroll-scrollbar-arrow]')
         const activeItemWork = el.closest('[data-tab-items]').querySelector('[data-scroll-content]').querySelector('[data-tab-subitem].-active')
         if (activeItemWork) {
            let toElement = arrowNext.hasAttribute('data-scroll-scrollbar-arrow-up') ? activeItemWork.previousElementSibling : activeItemWork.nextElementSibling

            if (toElement) {
               toElement.click()
               const wrap = toElement.closest('[data-scroll-wrap]')
               wrap.scrollTo({
                  top: toElement.offsetTop,
                  behavior: 'smooth'
               })
            }
         }
      }
   },
   // on mouseMove binded event
   onmousemove: function (e) {
      if (!e) e = window.event;
      // get vertical mouse position
      ssb.mouseY = e.screenY;

      if (ssb.asd.sg) ssb.asd.scrollTop = ssb.asd.sZ + (ssb.mouseY - ssb.asd.yZ) / ssb.asd.ratio;
   },
   // // on mouseUp binded event
   onmouseup: function (e) {
      if (!e) e = window.event;
      let tg = (e.target) ? e.target : e.srcElement;
      if (ssb.asd && document.releaseCapture) ssb.asd.releaseCapture();

      document.onselectstart = '';
      ssb.clear();
      ssb.asd.sg = false;
   }
}

window.onload = function () {
   const customScrollEl = document.querySelectorAll('[data-scroll]')
   if (customScrollEl.length) {
      customScrollEl.forEach(el => {
         ssb.scrollbar(el);
      })
   }
}

const headerElement = document.querySelector('.header')
document.addEventListener('click', actionDocument)
function actionDocument(e) {
   const target = e.target;
   if (target.closest('.burger-header')) {
      const burgerMenu = target.closest('.burger-header')
      const menu = document.querySelector('.menu')
      burgerMenu.classList.toggle('-active')
      menu.classList.toggle('-open')
      headerElement.classList.toggle('-active')
      document.body.classList.toggle('-lock')
   }
   if (target.closest('[data-btn-loadmore-news="close"]')) {
      e.preventDefault()
      const btnCloseNews = target.closest('[data-btn-loadmore-news="close"]')
      btnCloseNews.parentElement.classList.add('-hide')
      const btnOpenNews = document.querySelector('[data-btn-loadmore-news="open"]')
      btnOpenNews.classList.remove('-hide')
      btnOpenNews.parentElement.classList.remove('-hide')

      const itemBlogAdd = document.querySelectorAll('.item-blog.-add')
      if (itemBlogAdd.length > 0) {
         itemBlogAdd.forEach(itemBlog => itemBlog.remove())
      }

      const scrollToBlock = btnCloseNews.closest('.blog')
      const scrollToBlockValue = scrollToBlock.getBoundingClientRect().top + scrollY - document.querySelector('.header__height').offsetHeight

      window.scrollTo({
         top: scrollToBlockValue,
         behavior: 'smooth',
      })
   }
   if (target.closest('.main-screen__mouse a')) {
      e.preventDefault()
      const mouseScrollDown = target.closest('.main-screen__mouse a')
      const mainScreenElement = mouseScrollDown.closest('.main-screen')
      const scrollToBlock = mainScreenElement.nextElementSibling
      if (scrollToBlock) {
         const scrollToBlockValue = scrollToBlock.getBoundingClientRect().top + scrollY - document.querySelector('.header__height').offsetHeight

         window.scrollTo({
            top: scrollToBlockValue,
            behavior: 'smooth',
         })
      }
   }
}

const factsItem = document.querySelectorAll('.facts__item')
const mql = window.matchMedia('(min-width: 767.98px)')

function animationFactsImage() {
   factsItem.forEach(item => {
      const itemImage = item.querySelector('.facts__image')
      const itemTopCoordinate = (item.getBoundingClientRect().top + window.scrollY)
      const itemHeight = item.offsetHeight
      const imageParent = item.querySelector('.facts__main')
      const offsetImageParentHeight = Math.round(+window.getComputedStyle(imageParent, ':before').height.replace('px', ''))
      const paddingTopItem = +window.getComputedStyle(item).paddingTop.replace('px', '')

      if (mql.matches) {
         if (window.scrollY > itemTopCoordinate && window.scrollY < (itemTopCoordinate + offsetImageParentHeight + paddingTopItem)) {
            const heightImage = itemImage.offsetHeight
            const imageTop = +window.getComputedStyle(itemImage).top.replace('px', '')
            const partItemHeight = itemHeight / 4

            // itemImage.style.transform = 'translate(0px, 0px)'
            if (window.scrollY > (itemTopCoordinate + partItemHeight) && window.scrollY < (itemTopCoordinate + offsetImageParentHeight + paddingTopItem - heightImage - imageTop)) {
               const scrolledTopImage = partItemHeight - paddingTopItem
               const offsetImageY = scrollY - (itemTopCoordinate + paddingTopItem + scrolledTopImage)
               const opacityValue = 1 - (1 / (((offsetImageParentHeight - scrolledTopImage - imageTop) - heightImage) / offsetImageY))

               if (!isNaN(imageTop)) {
                  itemImage.style.opacity = opacityValue > 0 ? opacityValue : 0
               }
            } else {
               if (window.scrollY < (itemTopCoordinate + partItemHeight)) {

                  if (!item.classList.contains('facts__item_change-color')) {
                     itemImage.style.opacity = 1
                  }
               } else if (window.scrollY > (itemTopCoordinate + offsetImageParentHeight + paddingTopItem - heightImage - imageTop)) {
                  itemImage.style.opacity = 0

               }
            }
         } else {
            if (window.scrollY < (itemTopCoordinate - 64)) {
               if (!item.classList.contains('facts__item_change-color')) {
                  item.style.opacity = 1
               }
            }
         }
         if (window.scrollY > (itemTopCoordinate + offsetImageParentHeight)) {
            itemImage.style.opacity = 0
         } else if (window.scrollY > (itemTopCoordinate + offsetImageParentHeight + paddingTopItem)) {
            itemImage.style.opacity = ''
         }
      }

      if (item.classList.contains('facts__item_change-color')) {
         const itemTopCoordinate = item.getBoundingClientRect().top + window.scrollY
         const itemImage = item.querySelector('.facts__image')
         const paddingTopItem = +window.getComputedStyle(item).paddingTop.replace('px', '')
         const itemHeight = item.offsetHeight
         const heightImage = itemImage.offsetHeight
         const imageTop = +window.getComputedStyle(itemImage).top.replace('px', '')
         const partImageHeight = heightImage

         if (window.scrollY > (itemTopCoordinate - partImageHeight - paddingTopItem) && window.scrollY < itemTopCoordinate) {
            const offsetImageY = window.scrollY - ((itemTopCoordinate + 64) - partImageHeight - imageTop)
            const opacityValue = 1 / ((partImageHeight + imageTop - 64) / offsetImageY)
            // const transformValue = 350 - (350 / ((partImageHeight + imageTop - 64) / offsetImageY))

            if (!isNaN(imageTop)) {
               itemImage.style.opacity = opacityValue
               // itemImage.style.transform = `translate(0px, ${transformValue}px)`

               let getColor = function (colorsFirst, colorsLast) {
                  let arrColorBackground = []
                  for (let index = 0; index < 3; index++) {
                     arrColorBackground.push(colorsFirst[index] + (((colorsLast[index] - colorsFirst[index]) * offsetImageY) / (partImageHeight + paddingTopItem)))
                  }
                  return `rgb(${arrColorBackground.join()})`
               }
               document.body.style.backgroundColor = getColor([237, 236, 235], [49, 38, 41])
               const textsFact = item.querySelectorAll('.facts__name, .items-facts__list li, .items-facts__list li::before, .items-facts__label')
               textsFact.forEach(textElement => {
                  textElement.style.color = getColor([49, 38, 41], [255, 255, 255])
                  if (textElement.tagName == 'LI') {
                     textElement.querySelector('.point').style.backgroundColor = getColor([49, 38, 41], [255, 255, 255])
                  }
               })
            }
         } else {
            if (window.scrollY > itemTopCoordinate) {
               document.body.style.backgroundColor = 'rgb(49, 38, 41)'

               const textsFact = item.querySelectorAll('.facts__name, .items-facts__list li, .items-facts__list li::before, .items-facts__label')
               textsFact.forEach(textElement => {
                  textElement.style.color = 'rgb(255, 255, 255)'
                  if (textElement.tagName == 'LI') {
                     textElement.querySelector('.point').style.backgroundColor = 'rgb(255, 255, 255)'
                  }
               })
            }
            if (window.scrollY < (itemTopCoordinate - partImageHeight - paddingTopItem)) {
               itemImage.style.opacity = 0
               // itemImage.style.transform = ''
               document.body.style.backgroundColor = ''
               const textsFact = item.querySelectorAll('.facts__name, .items-facts__list li, .items-facts__list li::before, .items-facts__label')
               textsFact.forEach(textElement => {
                  textElement.style.color = ''
                  if (textElement.tagName == 'LI') {
                     textElement.querySelector('.point').style.backgroundColor = ''
                  }
               })
            }
         }
         if (window.scrollY > (itemTopCoordinate - partImageHeight - paddingTopItem) && window.scrollY < (itemTopCoordinate + itemHeight)) {
            item.classList.add('-change-bg')
         } else {
            item.classList.remove('-change-bg')
         }
      }

      if (!mql.matches) {
         itemImage.style.opacity = 1
      }
   })
}
window.addEventListener('scroll', animationFactsImage)
window.addEventListener('resize', animationFactsImage)
animationFactsImage()


SmoothScroll({
   animationTime: 500,
   stepSize: 75,
   accelerationDelta: 30,
   accelerationMax: 2,

   keyboardSupport: true,
   arrowScroll: 50,

   pulseAlgorithm: true,
   pulseScale: 4,
   pulseNormalize: 1,

   touchpadSupport: true,
})

const callback = function (entries, observer) {
   if (entries[0].isIntersecting) {
      headerElement.classList.remove('-scroll')
   } else {
      headerElement.classList.add('-scroll')
   }
}
const headerObserver = new IntersectionObserver(callback)
headerObserver.observe(headerElement)

document.addEventListener('mousemove', parallaxMainPictures)
function parallaxMainPictures(e) {
   if (scrollY < document.querySelector('.main-screen').offsetHeight) {
      this.querySelectorAll('.main-screen__image').forEach(picture => {
         const speed = picture.getAttribute('data-speed')

         const x = (window.innerWidth - e.pageX * speed) / 100
         const y = (window.innerHeight - e.pageY * speed) / 100

         picture.style.transform = `translateX(${x}px) translateY(${y}px)`
      })
   }
}

function activeSlidersWork() {
   const slidersWork = document.querySelectorAll('.slider-info-work__body')
   if (slidersWork.length > 0) {
      slidersWork.forEach(slider => {
         new Swiper(slider, {
            navigation: {
               nextEl: slider.parentElement.querySelector('.-arrow-slider_next'),
               prevEl: slider.parentElement.querySelector('.-arrow-slider_prev'),
            },
            pagination: {
               el: slider.parentElement.querySelector('.slider-info-work__fraction'),
               type: 'fraction'
            },
            simulateTouch: true,
            grabCursor: true,
            speed: 500,
            watchOverflow: false,
            nested: true,
            effect: 'fade',
            fadeEffect: {
               crossFade: true
            },
         })
      })
   }
}
activeSlidersWork()
const formsContact = document.querySelectorAll('.-contact-form')
if (formsContact.length > 0) {
   formsContact.forEach(formContact => {
      new ValidateForm(formContact, {
         method: 'GET',
         url: '',
         items: {
            input: formContact.querySelectorAll('input[type="text"].-req, input[type="tel"].-req'),
            checkbox: formContact.querySelectorAll('input[type="checkbox"].-req'),
         }
      })
   })
}
const sliderReviews = new Swiper('.slider-reviews__body', {
   navigation: {
      nextEl: '.slider-reviews__arrows .-arrow-slider_next',
      prevEl: '.slider-reviews__arrows .-arrow-slider_prev'
   },
   simulateTouch: false,
   watchOverflow: false,
   spaceBetween: 69,
   speed: 600,
   initialSlide: 1,
})


function animateMarquee(el, duration) {
   const innerEl = el.querySelector('[data-marquee-inner]');
   const innerWidth = innerEl.offsetWidth;
   const cloneEl = innerEl.cloneNode(true);
   el.appendChild(cloneEl);

   let start = performance.now();
   let progress;
   let translateX;

   requestAnimationFrame(function step(now) {
      progress = (now - start) / duration;

      if (progress > 1) {
         progress %= 1;
         start = now;
      }

      translateX = innerWidth * progress;

      innerEl.style.transform = `translate3d(-${translateX}px, 0 , 0)`;
      cloneEl.style.transform = `translate3d(-${translateX}px, 0 , 0)`;
      requestAnimationFrame(step);
   });
}

const marqueeElemnets = document.querySelectorAll('[data-marquee]')
if (marqueeElemnets.length > 0) {
   marqueeElemnets.forEach(marquee => {
      const speed = marquee.dataset.marquee
      animateMarquee(marquee, speed);
   })
}

new LoadMore({
   el: '[data-btn-loadmore-news="open"]',
   url: './json/news.json',
   method: 'json',
   afterGet: function (data, loadMoreBtn) {
      data.news.forEach(dataNews => {
         const templateItemNews = `
         <div class="blog__item item-blog -add">
            <a href="" class="item-blog__link"></a>
            <div class="item-blog__image -ai"><img src="${dataNews.img}" alt=""></div>
            <div class="item-blog__content">
               <div class="item-blog__header">
                  <h4 class="item-blog__title">${dataNews.title}</h4>
                  <div class="item-blog__date">${dataNews.date}</div>
               </div>
               <div class="item-blog__text">${dataNews.text}</div>
            </div>
         </div>
         `


         const blogWrap = document.querySelector('.blog__grid')
         blogWrap.insertAdjacentHTML(
            'beforeend',
            templateItemNews
         )
      })
      loadMoreBtn.classList.remove('-hold')
      loadMoreBtn.classList.add('-hide')

      const btnClose = document.querySelector('[data-btn-loadmore-news="close"]')

      if (767.98 > window.innerWidth) {
         loadMoreBtn.parentElement.classList.add('-hide')
      } else {
      }
      btnClose.parentElement.classList.remove('-hide')
   }
});

document.addEventListener('DOMContentLoaded', function () {
   const $minutes = document.querySelector('.consultations__text span:nth-child(1)');
   const $seconds = document.querySelector('.consultations__text span:nth-child(2)');

   var CurrentTime = new Date();
   CurrentTime.setMinutes(CurrentTime.getMinutes() + +$minutes.parentElement.dataset.time);
   const time = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDay(),
      hours: CurrentTime.getHours(),
      minutes: CurrentTime.getMinutes(),
   }
   const deadline = new Date(time.year, time.month, time.day, time.hours, time.minutes, new Date().getSeconds())

   let timerId = null;

   function countdownTimer() {
      let continueTimer = true
      if ($minutes.innerHTML == '00' && $seconds.innerHTML == '00') {
         continueTimer = false
      }
      if (continueTimer) {
         const diff = deadline - new Date();

         if (diff <= 0) {
            clearInterval(timerId);
         }
         const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
         const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
         $minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
         $seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
      }
   }


   countdownTimer();

   timerId = setInterval(countdownTimer, 1000);
});

const mqlTabletMax = window.matchMedia('(max-width: 767.98px)')
mqlTabletMax.addEventListener('change', activeSlidersQuestions)
activeSlidersQuestions(mqlTabletMax)
function activeSlidersQuestions(e) {
   if (e.matches) {
      const worksWrap = document.querySelectorAll('.works')
      if (worksWrap.length != 0) {
         worksWrap.forEach(wrap => {
            wrap.sliderMini = null
            wrap.sliderBig = null

            if (!wrap.sliderMini) {
               for (let index = 0; index < 2; index++) {
                  const arrowsSlider = `
                  <div class="works__arrow works__arrow_prev"><span class="-icon-arrow-right"></span></div>
                  <div class="works__arrow works__arrow_next"><span class="-icon-arrow-right"></span></div>`
                  wrap.insertAdjacentHTML(
                     'beforebegin',
                     `<div class="works__body works__body_${index == 0 ? 'mini' : 'big'} swiper">
                        <div class="works__wrapper swiper-wrapper"></div>
                        ${index == 0 ? arrowsSlider : ''}
                     </div>`
                  )
               }
               const sliderMiniElement = wrap.previousElementSibling.previousElementSibling
               const sliderBigElement = wrap.previousElementSibling

               const items = wrap.querySelectorAll('[data-tab-subitem]')
               const contents = wrap.querySelectorAll('[data-tab-content]')

               items.forEach(item => {
                  let itemHTML = item.innerHTML
                  sliderMiniElement.querySelector('.swiper-wrapper').insertAdjacentHTML(
                     'beforeend',
                     `<div class="works__item swiper-slide">${itemHTML}</div>`
                  )
                  item.remove()
               })
               contents.forEach(content => {
                  content.classList.add('swiper-slide')
                  sliderBigElement.querySelector('.swiper-wrapper').append(content)
               })

               wrap.sliderMini = new Swiper(sliderMiniElement, {
                  navigation: {
                     nextEl: sliderMiniElement.querySelector('.works__arrow_next'),
                     prevEl: sliderMiniElement.querySelector('.works__arrow_prev')
                  },
                  simulateTouch: true,
                  watchOverflow: false,
                  effect: 'fade',
                  speed: 500,
                  fadeEffect: {
                     crossFade: true
                  },
               })
               wrap.sliderBig = new Swiper(sliderBigElement, {
                  simulateTouch: true,
                  watchOverflow: false,
                  speed: 500,
                  effect: 'fade',
                  fadeEffect: {
                     crossFade: true
                  },
               })
               wrap.sliderBig.controller.control = wrap.sliderMini
               wrap.sliderMini.controller.control = wrap.sliderBig
            }
         })
      }
   } else {
      const worksWrap = document.querySelectorAll('.works')
      if (worksWrap.length != 0) {
         worksWrap.forEach(wrap => {
            if (wrap.previousElementSibling) {
               const sliderMiniElement = wrap.previousElementSibling.previousElementSibling
               const sliderBigElement = wrap.previousElementSibling

               const items = sliderMiniElement.querySelectorAll('.swiper-slide')
               const contents = sliderBigElement.querySelectorAll('.works__content')


               items.forEach((item, index) => {
                  let itemHTML = item.innerHTML
                  wrap.querySelector('[data-tab-items] [data-scroll-content]').insertAdjacentHTML(
                     'beforeend',
                     `<a href="" class="works__item" data-tab-subitem="${++index}">${itemHTML}</a>`
                  )
                  item.remove()
               })
               
               // active item (tablet)
               wrap.querySelector('[data-tab-items] [data-scroll-content] [data-tab-subitem]').click()

               contents.forEach(content => {
                  content.classList.remove('swiper-slide')
                  wrap.querySelector('[data-tab-items]').nextElementSibling.append(content)
               })

               sliderMiniElement.remove()
               sliderBigElement.remove()
            }
            if (wrap.sliderMini && wrap.sliderBig) {
               [wrap.sliderMini, wrap.sliderBig].forEach(slider => {
                  slider.destroy()
                  slider = null
               })
            }
         })
      }
   }
}

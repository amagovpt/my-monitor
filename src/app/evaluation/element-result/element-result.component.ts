import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import clone from "lodash.clone";

import { EvaluationService } from "../evaluation.service";

@Component({
  selector: "app-element-result",
  templateUrl: "./element-result.component.html",
  styleUrls: ["./element-result.component.scss"],
})
export class ElementResultPageComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("iframe") iframe: ElementRef;

  sub: Subscription;

  url: string;
  finalUrl: any;

  data: any;
  ele: string;

  tabs: HTMLElement[] = [];
  panels: HTMLElement[] = [];
  tablist: HTMLElement;

  keys: any;
  direction: any;

  constructor(
    private router: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private evaluation: EvaluationService
  ) {
    this.data = {};
  }

  ngOnInit(): void {
    const button = document.getElementById("exp_button3");
    const exListbox = new Listbox(document.getElementById("exp_elem_list3"));
    const listboxButton = new ListboxButton(button, exListbox);
    listboxButton.setHandleFocusChange(this.listboxFocusChange.bind(this));

    const button2 = document.getElementById("exp_button");
    const exListbox2 = new Listbox2(document.getElementById("exp_elem_list"));
    const listboxButton2 = new ListboxButton2(button2, exListbox2);
    listboxButton2.setHandleFocusChange(this.listboxFocusChange2.bind(this));

    this.sub = this.router.params.subscribe((params) => {
      this.url = decodeURIComponent(params.url);
      this.ele = params.ele;

      this.data = this.evaluation.getTestResults(this.ele);

      this.keys = {
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
      };
      this.direction = {
        37: -1,
        38: -1,
        39: 1,
        40: 1,
      };
      this.tablist =
        document.querySelectorAll<HTMLElement>('[role="tablist"]')[0];

      this.generateArrays();
      this.bindListeners();
    });
  }

  ngAfterViewInit(): void {
    if (this.ele !== "titleOk" && this.ele !== "lang") {
      const images = document.querySelectorAll(".img img");

      for (let i = 0; i < images.length; i++) {
        const img = images.item(i);

        if (img["width"] > 500 || img["height"] > 200) {
          if (img["width"] > img["height"]) {
            img["width"] = "500";
          } else {
            img["height"] = "200";
          }
        }
      }
    }

    if (this.data.page) {
      const doc =
        this.iframe.nativeElement.contentDocument ||
        this.iframe.nativeElement.contentWindow;
      doc.open();
      doc.write(this.data.page);
      doc.close();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  listboxFocusChange(focusItem: HTMLElement) {
    focusItem.click();
  }

  listboxFocusChange2(tabId: number) {
    const tab = this.tabs[tabId - 1];
    this.activateTab(tab, false);
  }

  generateArrays() {
    const tabs = document.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs.forEach((tab) => this.tabs.push(tab));
    const panels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    panels.forEach((panel) => this.panels.push(panel));
  }

  bindListeners() {
    for (const tab of this.tabs) {
      tab.addEventListener("click", this.clickEventListener.bind(this));
      tab.addEventListener("keydown", this.keydownEventListener.bind(this));
      tab.addEventListener("keyup", this.keyupEventListener.bind(this));
    }
  }

  clickEventListener(event) {
    const tab = event.target;
    this.activateTab(tab, false);
  }

  keydownEventListener(event) {
    const key = event.keyCode;

    switch (key) {
      case this.keys.end:
        event.preventDefault();
        // Activate last tab
        this.activateTab(this.tabs[this.tabs.length - 1], true);
        break;
      case this.keys.home:
        event.preventDefault();
        // Activate first tab
        this.activateTab(this.tabs[0], true);
        break;

      // Up and down are in keydown
      // because we need to prevent page scroll >:)
      case this.keys.up:
      case this.keys.down:
        this.determineOrientation(event);
        break;
    }
  }

  keyupEventListener(event) {
    const key = event.keyCode;

    switch (key) {
      case this.keys.left:
      case this.keys.right:
        this.determineOrientation(event);
        break;
    }
  }

  determineOrientation(event) {
    const key = event.keyCode;
    const vertical =
      this.tablist.getAttribute("aria-orientation") == "vertical";
    let proceed = false;

    if (vertical) {
      if (key === this.keys.up || key === this.keys.down) {
        event.preventDefault();
        proceed = true;
      }
    } else {
      if (key === this.keys.left || key === this.keys.right) {
        proceed = true;
      }
    }
    if (proceed) {
      this.switchTabOnArrowPress(event);
    }
  }

  switchTabOnArrowPress(event) {
    const pressed = event.keyCode;

    for (const tab of this.tabs) {
      tab.addEventListener("focus", this.focusEventHandler.bind(this));
    }

    if (this.direction[pressed]) {
      const target = event.target;
      const index = this.tabs.indexOf(target);
      if (index !== undefined) {
        if (this.tabs[index + this.direction[pressed]]) {
          this.tabs[index + this.direction[pressed]].focus();
        } else if (pressed === this.keys.left || pressed === this.keys.up) {
          this.focusLastTab();
        } else if (pressed === this.keys.right || pressed === this.keys.down) {
          this.focusFirstTab();
        }
      }
    }
  }

  activateTab(tab: HTMLElement, setFocus: boolean) {
    setFocus = setFocus || true;
    // Deactivate all other tabs
    this.deactivateTabs();

    // Remove tabindex attribute
    tab.removeAttribute("tabindex");

    // Set the tab as selected
    tab.setAttribute("aria-selected", "true");

    // Get the value of aria-controls (which is an ID)
    const controls = tab.getAttribute("aria-controls");

    // Remove is-hidden class from tab panel to make it visible
    document.getElementById(controls).classList.remove("is-hidden");

    // Set focus when required
    if (setFocus) {
      tab.focus();
    }
  }

  deactivateTabs() {
    for (const tab of this.tabs) {
      tab.setAttribute("tabindex", "-1");
      tab.setAttribute("aria-selected", "false");
      tab.removeEventListener("focus", this.focusEventHandler);
    }

    for (const panel of this.panels) {
      panel.classList.add("is-hidden");
    }
  }

  focusFirstTab() {
    this.tabs[0].focus();
  }

  focusLastTab() {
    this.tabs[this.tabs.length - 1].focus();
  }

  checkTabFocus(target) {
    const focused = document.activeElement;

    if (target === focused) {
      this.activateTab(target, false);
    }
  }

  focusEventHandler(event) {
    const target = event.target;
    const delay = 300;

    setTimeout(this.checkTabFocus.bind(this), delay, target);
  }
}

class Listbox {
  listboxNode: HTMLElement;
  activeDescendant: string;
  upButton;
  downButton;
  moveButton;

  keys;

  constructor(listboxNode: HTMLElement) {
    this.keys = {
      backspace: 8,
      return: 13,
      space: 32,
      page_up: 33,
      page_down: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46,
    };
    this.listboxNode = listboxNode;
    this.activeDescendant = this.listboxNode.getAttribute(
      "aria-activedescendant"
    );
    this.upButton = null;
    this.downButton = null;
    this.moveButton = null;
    this.registerEvents();
  }

  handleFocusChange(element) {}

  handleItemChange(event, items) {}

  registerEvents() {
    this.listboxNode.addEventListener("focus", this.setupFocus.bind(this));
    this.listboxNode.addEventListener("keydown", this.checkKeyPress.bind(this));
    this.listboxNode.addEventListener("click", this.checkClickItem.bind(this));
  }

  setupFocus() {
    if (this.activeDescendant) {
      return;
    }
  }

  focusFirstItem() {
    const firstItem = this.listboxNode.querySelector('[role="option"]');

    if (firstItem) {
      this.focusItem(firstItem);
    }
  }

  focusLastItem() {
    const itemList = this.listboxNode.querySelectorAll('[role="option"]');

    if (itemList.length) {
      this.focusItem(itemList[itemList.length - 1]);
    }
  }

  checkKeyPress(evt) {
    const key = evt.which || evt.keyCode;
    const lastActiveId = this.activeDescendant;
    const firstItem = this.listboxNode.querySelector('[role="option"]');
    let nextItem = document.getElementById(this.activeDescendant) || firstItem;

    if (!nextItem) {
      return;
    }

    switch (key) {
      case this.keys.up:
      case this.keys.down:
        evt.preventDefault();

        if (!this.activeDescendant) {
          // focus first option if no option was previously focused, and perform no other actions
          this.focusItem(nextItem);
          break;
        }

        if (key === this.keys.up) {
          nextItem = this.findPreviousOption(nextItem);
        } else {
          nextItem = this.findNextOption(nextItem);
        }

        if (nextItem) {
          this.focusItem(nextItem);
        }

        break;
      case this.keys.home:
        evt.preventDefault();
        this.focusFirstItem();
        break;
      case this.keys.end:
        evt.preventDefault();
        this.focusLastItem();
        break;
      case this.keys.space:
      case this.keys.return:
        evt.preventDefault();
        this.followLink(nextItem);
      default:
        break;
    }

    if (this.activeDescendant !== lastActiveId) {
      this.updateScroll();
    }
  }

  followLink(target) {
    this.handleFocusChange(target.firstChild as HTMLElement);
  }

  findNextOption(currentOption) {
    const allOptions = Array.prototype.slice.call(
      this.listboxNode.querySelectorAll('[role="option"]')
    ); // get options array
    const currentOptionIndex = allOptions.indexOf(currentOption);
    let nextOption = null;

    if (currentOptionIndex > -1 && currentOptionIndex < allOptions.length - 1) {
      nextOption = allOptions[currentOptionIndex + 1];
    }

    return nextOption;
  }

  findPreviousOption(currentOption) {
    const allOptions = Array.prototype.slice.call(
      this.listboxNode.querySelectorAll('[role="option"]')
    ); // get options array
    const currentOptionIndex = allOptions.indexOf(currentOption);
    let previousOption = null;

    if (currentOptionIndex > -1 && currentOptionIndex > 0) {
      previousOption = allOptions[currentOptionIndex - 1];
    }

    return previousOption;
  }

  checkClickItem(evt) {
    if (evt.target.getAttribute("role") === "option") {
      this.focusItem(evt.target);
      evt.target.parentNode.blur();
    }
  }

  defocusItem(element) {
    if (!element) {
      return;
    }
    element.removeAttribute("aria-selected");
    element.classList.remove("focused");
  }

  focusItem(element) {
    this.defocusItem(document.getElementById(this.activeDescendant));
    element.setAttribute("aria-selected", "true");
    element.classList.add("focused");
    this.listboxNode.setAttribute("aria-activedescendant", element.id);
    this.activeDescendant = element.id;

    this.checkUpDownButtons();
  }

  updateScroll() {
    const selectedOption = document.getElementById(this.activeDescendant);
    if (
      selectedOption &&
      this.listboxNode.scrollHeight > this.listboxNode.clientHeight
    ) {
      const scrollBottom =
        this.listboxNode.clientHeight + this.listboxNode.scrollTop;
      const elementBottom =
        selectedOption.offsetTop + selectedOption.offsetHeight;
      if (elementBottom > scrollBottom) {
        this.listboxNode.scrollTop =
          elementBottom - this.listboxNode.clientHeight;
      } else if (selectedOption.offsetTop < this.listboxNode.scrollTop) {
        this.listboxNode.scrollTop = selectedOption.offsetTop;
      }
    }
  }

  checkUpDownButtons() {
    const activeElement = document.getElementById(this.activeDescendant);

    if (!activeElement) {
      this.upButton.setAttribute("aria-disabled", "true");
      this.downButton.setAttribute("aria-disabled", "true");
      return;
    }

    if (this.upButton) {
      if (activeElement.previousElementSibling) {
        this.upButton.setAttribute("aria-disabled", false);
      } else {
        this.upButton.setAttribute("aria-disabled", "true");
      }
    }

    if (this.downButton) {
      if (activeElement.nextElementSibling) {
        this.downButton.setAttribute("aria-disabled", false);
      } else {
        this.downButton.setAttribute("aria-disabled", "true");
      }
    }
  }

  clearActiveDescendant() {
    this.activeDescendant = null;
    this.listboxNode.setAttribute("aria-activedescendant", null);

    if (this.moveButton) {
      this.moveButton.setAttribute("aria-disabled", "true");
    }

    this.checkUpDownButtons();
  }

  setHandleItemChange(handlerFn) {
    this.handleItemChange = handlerFn;
  }

  setHandleFocusChange(focusChangeHandler) {
    this.handleFocusChange = focusChangeHandler;
  }
}

class ListboxButton {
  button: HTMLElement;
  listbox: Listbox;
  keys;

  constructor(button: HTMLElement, listbox: Listbox) {
    this.keys = {
      backspace: 8,
      return: 13,
      space: 32,
      page_up: 33,
      page_down: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46,
    };
    this.button = button;
    this.listbox = listbox;
    this.registerEvents();
  }

  registerEvents() {
    this.button.addEventListener("click", this.showListbox.bind(this));
    this.button.addEventListener("keyup", this.checkShow.bind(this));
    this.listbox.listboxNode.addEventListener(
      "blur",
      this.hideListbox.bind(this)
    );
    this.listbox.listboxNode.addEventListener(
      "keydown",
      this.checkHide.bind(this)
    );
    this.listbox.setHandleFocusChange(this.onFocusChange.bind(this));
  }

  handleFocusChange(tabId) {}

  setHandleFocusChange(focusChangeHandler) {
    this.handleFocusChange = focusChangeHandler;
  }

  checkShow(evt) {
    const key = evt.which || evt.keyCode;

    switch (key) {
      case this.keys.up:
      case this.keys.down:
        evt.preventDefault();
        this.showListbox();
        this.listbox.checkKeyPress(evt);
        break;
    }
  }

  checkHide(evt) {
    const key = evt.which || evt.keyCode;

    switch (key) {
      case this.keys.return:
      case this.keys.esc:
        evt.preventDefault();
        this.hideListbox();
        this.button.focus();
        break;
    }
  }

  showListbox() {
    this.removeClass(this.listbox.listboxNode, "hidden");
    this.button.setAttribute("aria-expanded", "true");
    this.listbox.listboxNode.focus();
  }

  hideListbox() {
    this.addClass(this.listbox.listboxNode, "hidden");
    this.button.removeAttribute("aria-expanded");
  }

  addClass(element, className) {
    if (!this.hasClass(element, className)) {
      element.className += " " + className;
    }
  }

  onFocusChange(focusedItem) {
    this.handleFocusChange(focusedItem);
  }

  removeClass(element, className) {
    const classRegex = new RegExp("(\\s|^)" + className + "(\\s|$)");
    element.className = element.className.replace(classRegex, " ").trim();
  }

  hasClass(element, className) {
    return new RegExp("(\\s|^)" + className + "(\\s|$)").test(
      element.className
    );
  }
}

class Listbox2 {
  listboxNode: HTMLElement;
  activeDescendant: string;
  upButton;
  downButton;
  moveButton;

  keys;

  constructor(listboxNode: HTMLElement) {
    this.keys = {
      backspace: 8,
      return: 13,
      space: 32,
      page_up: 33,
      page_down: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46,
    };
    this.listboxNode = listboxNode;
    this.activeDescendant = this.listboxNode.getAttribute(
      "aria-activedescendant"
    );
    this.upButton = null;
    this.downButton = null;
    this.moveButton = null;
    this.registerEvents();
  }

  handleFocusChange(element) {}

  handleItemChange(event, items) {}

  registerEvents() {
    this.listboxNode.addEventListener("focus", this.setupFocus.bind(this));
    this.listboxNode.addEventListener("keydown", this.checkKeyPress.bind(this));
    this.listboxNode.addEventListener("click", this.checkClickItem.bind(this));
  }

  setupFocus() {
    if (this.activeDescendant) {
      return;
    }
  }

  focusFirstItem() {
    const firstItem = this.listboxNode.querySelector(".option2");

    if (firstItem) {
      this.focusItem(firstItem);
    }
  }

  focusLastItem() {
    const itemList = this.listboxNode.querySelectorAll(".option2");

    if (itemList.length) {
      this.focusItem(itemList[itemList.length - 1]);
    }
  }

  checkKeyPress(evt) {
    const key = evt.which || evt.keyCode;
    const lastActiveId = this.activeDescendant;
    const firstItem = this.listboxNode.querySelector(".option2");
    let nextItem = document.getElementById(this.activeDescendant) || firstItem;

    if (!nextItem) {
      return;
    }

    switch (key) {
      case this.keys.up:
      case this.keys.down:
        evt.preventDefault();
        if (!this.activeDescendant) {
          // focus first option if no option was previously focused, and perform no other actions
          this.focusItem(nextItem);
          break;
        }

        if (key === this.keys.up) {
          nextItem = this.findPreviousOption(nextItem);
        } else {
          nextItem = this.findNextOption(nextItem);
        }

        if (nextItem) {
          this.focusItem(nextItem);
        }

        break;
      case this.keys.home:
        evt.preventDefault();
        this.focusFirstItem();
        break;
      case this.keys.end:
        evt.preventDefault();
        this.focusLastItem();
        break;
      default:
        break;
    }

    if (this.activeDescendant !== lastActiveId) {
      this.updateScroll();
    }
  }

  findNextOption(currentOption) {
    const allOptions = Array.prototype.slice.call(
      this.listboxNode.querySelectorAll(".option2")
    ); // get options array
    const currentOptionIndex = allOptions.indexOf(currentOption);
    let nextOption = null;

    if (currentOptionIndex > -1 && currentOptionIndex < allOptions.length - 1) {
      nextOption = allOptions[currentOptionIndex + 1];
    }

    return nextOption;
  }

  findPreviousOption(currentOption) {
    const allOptions = Array.prototype.slice.call(
      this.listboxNode.querySelectorAll(".option2")
    ); // get options array
    const currentOptionIndex = allOptions.indexOf(currentOption);
    let previousOption = null;

    if (currentOptionIndex > -1 && currentOptionIndex > 0) {
      previousOption = allOptions[currentOptionIndex - 1];
    }

    return previousOption;
  }

  checkClickItem(evt) {
    if (evt.target.getAttribute("role") === "option") {
      this.focusItem(evt.target);
      evt.target.parentNode.blur();
    }
  }

  defocusItem(element) {
    if (!element) {
      return;
    }
    element.removeAttribute("aria-selected");
    element.classList.remove("focused");
  }

  focusItem(element) {
    this.defocusItem(document.getElementById(this.activeDescendant));
    element.setAttribute("aria-selected", "true");
    element.classList.add("focused");
    this.listboxNode.setAttribute("aria-activedescendant", element.id);
    this.activeDescendant = element.id;

    this.checkUpDownButtons();
    this.handleFocusChange(element);
  }

  updateScroll() {
    const selectedOption = document.getElementById(this.activeDescendant);
    if (
      selectedOption &&
      this.listboxNode.scrollHeight > this.listboxNode.clientHeight
    ) {
      const scrollBottom =
        this.listboxNode.clientHeight + this.listboxNode.scrollTop;
      const elementBottom =
        selectedOption.offsetTop + selectedOption.offsetHeight;
      if (elementBottom > scrollBottom) {
        this.listboxNode.scrollTop =
          elementBottom - this.listboxNode.clientHeight;
      } else if (selectedOption.offsetTop < this.listboxNode.scrollTop) {
        this.listboxNode.scrollTop = selectedOption.offsetTop;
      }
    }
  }

  checkUpDownButtons() {
    const activeElement = document.getElementById(this.activeDescendant);

    if (!activeElement) {
      this.upButton.setAttribute("aria-disabled", "true");
      this.downButton.setAttribute("aria-disabled", "true");
      return;
    }

    if (this.upButton) {
      if (activeElement.previousElementSibling) {
        this.upButton.setAttribute("aria-disabled", false);
      } else {
        this.upButton.setAttribute("aria-disabled", "true");
      }
    }

    if (this.downButton) {
      if (activeElement.nextElementSibling) {
        this.downButton.setAttribute("aria-disabled", false);
      } else {
        this.downButton.setAttribute("aria-disabled", "true");
      }
    }
  }

  clearActiveDescendant() {
    this.activeDescendant = null;
    this.listboxNode.setAttribute("aria-activedescendant", null);

    if (this.moveButton) {
      this.moveButton.setAttribute("aria-disabled", "true");
    }

    this.checkUpDownButtons();
  }

  setHandleItemChange(handlerFn) {
    this.handleItemChange = handlerFn;
  }

  setHandleFocusChange(focusChangeHandler) {
    this.handleFocusChange = focusChangeHandler;
  }
}

class ListboxButton2 {
  button: HTMLElement;
  listbox: Listbox2;
  keys;

  constructor(button: HTMLElement, listbox: Listbox2) {
    this.keys = {
      backspace: 8,
      return: 13,
      space: 32,
      page_up: 33,
      page_down: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46,
    };
    this.button = button;
    this.listbox = listbox;
    this.registerEvents();
  }

  registerEvents() {
    this.button.addEventListener("click", this.showListbox.bind(this));
    this.button.addEventListener("keyup", this.checkShow.bind(this));
    this.listbox.listboxNode.addEventListener(
      "blur",
      this.hideListbox.bind(this)
    );
    this.listbox.listboxNode.addEventListener(
      "keydown",
      this.checkHide.bind(this)
    );
    this.listbox.setHandleFocusChange(this.onFocusChange.bind(this));
  }

  handleFocusChange(tabId) {}

  setHandleFocusChange(focusChangeHandler) {
    this.handleFocusChange = focusChangeHandler;
  }

  checkShow(evt) {
    const key = evt.which || evt.keyCode;

    switch (key) {
      case this.keys.up:
      case this.keys.down:
        evt.preventDefault();
        this.showListbox();
        this.listbox.checkKeyPress(evt);
        break;
    }
  }

  checkHide(evt) {
    const key = evt.which || evt.keyCode;

    switch (key) {
      case this.keys.return:
      case this.keys.esc:
        evt.preventDefault();
        this.hideListbox();
        this.button.focus();
        break;
    }
  }

  showListbox() {
    this.removeClass(this.listbox.listboxNode, "hidden");
    this.button.setAttribute("aria-expanded", "true");
    this.listbox.listboxNode.focus();
  }

  hideListbox() {
    this.addClass(this.listbox.listboxNode, "hidden");
    this.button.removeAttribute("aria-expanded");
  }

  addClass(element, className) {
    if (!this.hasClass(element, className)) {
      element.className += " " + className;
    }
  }

  onFocusChange(focusedItem) {
    this.button.innerText = focusedItem.innerText;
    const idString = focusedItem.getAttribute("id");
    const tabId = idString.charAt(idString.length - 1);
    this.handleFocusChange(tabId);
  }

  removeClass(element, className) {
    const classRegex = new RegExp("(\\s|^)" + className + "(\\s|$)");
    element.className = element.className.replace(classRegex, " ").trim();
  }

  hasClass(element, className) {
    return new RegExp("(\\s|^)" + className + "(\\s|$)").test(
      element.className
    );
  }
}

# PrimeNG Component Naming — Old → New (Comprehensive)

**Scope.** This table maps **previous PrimeNG component names** (v17 and earlier) to the **current names** (v18–v20). Where a component was **renamed**, the old name appears in the left column and the new name in the right. If a component **kept the same name**, it appears unchanged in both columns. Deprecated/removed components and their suggested replacements are listed at the end.

**Authoritative sources:** current component index and v19 migration notes (renames, deprecations). :contentReference[oaicite:0]{index=0}

---

## A. Full Component List (Current Name vs. Old Name)

> Unless noted otherwise, names did **not** change between v17 → v18+. Renames called out by the migration guide are marked **(RENAMED)**. :contentReference[oaicite:1]{index=1}

| **Current Component (v18–v20)** | **Previous Name (v17 and earlier)** | **Notes / Category**                                                                                               |
| ------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| AutoComplete                    | AutoComplete                        | Form. :contentReference[oaicite:2]{index=2}                                                                        |
| CascadeSelect                   | CascadeSelect                       | Form. :contentReference[oaicite:3]{index=3}                                                                        |
| Checkbox                        | Checkbox                            | Form. :contentReference[oaicite:4]{index=4}                                                                        |
| ColorPicker                     | ColorPicker                         | Form. :contentReference[oaicite:5]{index=5}                                                                        |
| **DatePicker**                  | **Calendar**                        | **(RENAMED)** v19 migration. :contentReference[oaicite:6]{index=6}                                                 |
| Editor                          | Editor                              | Form. :contentReference[oaicite:7]{index=7}                                                                        |
| FloatLabel                      | FloatLabel                          | Form utility. :contentReference[oaicite:8]{index=8}                                                                |
| IconField                       | IconField                           | Form utility. :contentReference[oaicite:9]{index=9}                                                                |
| IftaLabel                       | IftaLabel                           | Form utility. :contentReference[oaicite:10]{index=10}                                                              |
| InputGroup                      | InputGroup                          | Form layout. :contentReference[oaicite:11]{index=11}                                                               |
| InputMask                       | InputMask                           | Form. :contentReference[oaicite:12]{index=12}                                                                      |
| InputNumber                     | InputNumber                         | Form. :contentReference[oaicite:13]{index=13}                                                                      |
| InputOtp                        | InputOtp                            | Form. :contentReference[oaicite:14]{index=14}                                                                      |
| InputText                       | InputText                           | Form. :contentReference[oaicite:15]{index=15}                                                                      |
| KeyFilter                       | KeyFilter                           | Form directive. :contentReference[oaicite:16]{index=16}                                                            |
| Knob                            | Knob                                | Form/visual. :contentReference[oaicite:17]{index=17}                                                               |
| Listbox                         | Listbox                             | Form. :contentReference[oaicite:18]{index=18}                                                                      |
| MultiSelect                     | MultiSelect                         | Form. :contentReference[oaicite:19]{index=19}                                                                      |
| Password                        | Password                            | Form. :contentReference[oaicite:20]{index=20}                                                                      |
| RadioButton                     | RadioButton                         | Form. :contentReference[oaicite:21]{index=21}                                                                      |
| Rating                          | Rating                              | Form. :contentReference[oaicite:22]{index=22}                                                                      |
| **Select**                      | **Dropdown**                        | **(RENAMED)** v19 migration. :contentReference[oaicite:23]{index=23}                                               |
| SelectButton                    | SelectButton                        | Form. :contentReference[oaicite:24]{index=24}                                                                      |
| Slider                          | Slider                              | Form. :contentReference[oaicite:25]{index=25}                                                                      |
| Textarea                        | Textarea                            | Form. :contentReference[oaicite:26]{index=26}                                                                      |
| ToggleButton                    | ToggleButton                        | Form (unchanged). :contentReference[oaicite:27]{index=27}                                                          |
| **ToggleSwitch**                | **InputSwitch**                     | **(RENAMED)** v19 migration. :contentReference[oaicite:28]{index=28}                                               |
| TreeSelect                      | TreeSelect                          | Form. :contentReference[oaicite:29]{index=29}                                                                      |
| Button                          | Button                              | Button. :contentReference[oaicite:30]{index=30}                                                                    |
| SpeedDial                       | SpeedDial                           | Button. :contentReference[oaicite:31]{index=31}                                                                    |
| SplitButton                     | SplitButton                         | Button. :contentReference[oaicite:32]{index=32}                                                                    |
| DataView                        | DataView                            | Data. :contentReference[oaicite:33]{index=33}                                                                      |
| OrderList                       | OrderList                           | Data. :contentReference[oaicite:34]{index=34}                                                                      |
| OrgChart                        | OrgChart                            | Data. :contentReference[oaicite:35]{index=35}                                                                      |
| Paginator                       | Paginator                           | Data. :contentReference[oaicite:36]{index=36}                                                                      |
| PickList                        | PickList                            | Data. :contentReference[oaicite:37]{index=37}                                                                      |
| Table                           | Table                               | Data. :contentReference[oaicite:38]{index=38}                                                                      |
| Timeline                        | Timeline                            | Data. :contentReference[oaicite:39]{index=39}                                                                      |
| Tree                            | Tree                                | Data. :contentReference[oaicite:40]{index=40}                                                                      |
| TreeTable                       | TreeTable                           | Data. :contentReference[oaicite:41]{index=41}                                                                      |
| VirtualScroller                 | VirtualScroller                     | Data/utility. :contentReference[oaicite:42]{index=42}                                                              |
| Accordion                       | Accordion                           | Panel. (Note: Tab-based “Accordion” API updated in v19; see deprecations.) :contentReference[oaicite:43]{index=43} |
| Card                            | Card                                | Panel. :contentReference[oaicite:44]{index=44}                                                                     |
| Divider                         | Divider                             | Panel. :contentReference[oaicite:45]{index=45}                                                                     |
| Fieldset                        | Fieldset                            | Panel. :contentReference[oaicite:46]{index=46}                                                                     |
| Panel                           | Panel                               | Panel. :contentReference[oaicite:47]{index=47}                                                                     |
| ScrollPanel                     | ScrollPanel                         | Panel. :contentReference[oaicite:48]{index=48}                                                                     |
| Splitter                        | Splitter                            | Panel/layout. :contentReference[oaicite:49]{index=49}                                                              |
| Stepper                         | Steps / Stepper                     | Current is **Stepper**; see deprecations for **Steps**. :contentReference[oaicite:50]{index=50}                    |
| Tabs                            | TabView / Tabs                      | Current is **Tabs**; see deprecations for **TabView**. :contentReference[oaicite:51]{index=51}                     |
| Toolbar                         | Toolbar                             | Panel. :contentReference[oaicite:52]{index=52}                                                                     |
| ConfirmDialog                   | ConfirmDialog                       | Overlay. :contentReference[oaicite:53]{index=53}                                                                   |
| ConfirmPopup                    | ConfirmPopup                        | Overlay. :contentReference[oaicite:54]{index=54}                                                                   |
| Dialog                          | Dialog                              | Overlay. :contentReference[oaicite:55]{index=55}                                                                   |
| **Drawer**                      | **Sidebar**                         | **(RENAMED)** v19 migration. :contentReference[oaicite:56]{index=56}                                               |
| DynamicDialog                   | DynamicDialog                       | Overlay. :contentReference[oaicite:57]{index=57}                                                                   |
| **Popover**                     | **OverlayPanel**                    | **(RENAMED)** v19 migration. :contentReference[oaicite:58]{index=58}                                               |
| Tooltip                         | Tooltip                             | Overlay. :contentReference[oaicite:59]{index=59}                                                                   |
| Upload                          | FileUpload / Upload                 | Current page is **Upload**. (Imports historically `primeng/fileupload`.) :contentReference[oaicite:60]{index=60}   |
| Breadcrumb                      | Breadcrumb                          | Menu. :contentReference[oaicite:61]{index=61}                                                                      |
| ContextMenu                     | ContextMenu                         | Menu. :contentReference[oaicite:62]{index=62}                                                                      |
| Dock                            | Dock                                | Menu. :contentReference[oaicite:63]{index=63}                                                                      |
| Menu                            | Menu                                | Menu. :contentReference[oaicite:64]{index=64}                                                                      |
| Menubar                         | Menubar                             | Menu. :contentReference[oaicite:65]{index=65}                                                                      |
| MegaMenu                        | MegaMenu                            | Menu. :contentReference[oaicite:66]{index=66}                                                                      |
| PanelMenu                       | PanelMenu                           | Menu. :contentReference[oaicite:67]{index=67}                                                                      |
| TieredMenu                      | TieredMenu                          | Menu. :contentReference[oaicite:68]{index=68}                                                                      |
| Chart.js                        | Chart.js                            | Chart integration. :contentReference[oaicite:69]{index=69}                                                         |
| Message                         | Message                             | Messages. (See deprecations for **Messages** wrapper.) :contentReference[oaicite:70]{index=70}                     |
| Toast                           | Toast                               | Messages. :contentReference[oaicite:71]{index=71}                                                                  |
| Carousel                        | Carousel                            | Media. :contentReference[oaicite:72]{index=72}                                                                     |
| Galleria                        | Galleria                            | Media. :contentReference[oaicite:73]{index=73}                                                                     |
| Image                           | Image                               | Media. :contentReference[oaicite:74]{index=74}                                                                     |
| ImageCompare                    | ImageCompare                        | Media. :contentReference[oaicite:75]{index=75}                                                                     |
| AnimateOnScroll                 | AnimateOnScroll                     | Misc. :contentReference[oaicite:76]{index=76}                                                                      |
| AutoFocus                       | AutoFocus                           | Misc. :contentReference[oaicite:77]{index=77}                                                                      |
| Avatar                          | Avatar                              | Misc. :contentReference[oaicite:78]{index=78}                                                                      |
| Badge                           | Badge                               | Misc. :contentReference[oaicite:79]{index=79}                                                                      |
| BlockUI                         | BlockUI                             | Misc. :contentReference[oaicite:80]{index=80}                                                                      |
| Chip                            | Chip                                | Misc. :contentReference[oaicite:81]{index=81}                                                                      |
| FocusTrap                       | FocusTrap                           | Misc. :contentReference[oaicite:82]{index=82}                                                                      |
| Fluid                           | Fluid                               | Misc (layout utility). :contentReference[oaicite:83]{index=83}                                                     |
| Inplace                         | Inplace                             | Misc. :contentReference[oaicite:84]{index=84}                                                                      |
| MeterGroup                      | MeterGroup                          | Misc. :contentReference[oaicite:85]{index=85}                                                                      |
| ScrollTop                       | ScrollTop                           | Misc. :contentReference[oaicite:86]{index=86}                                                                      |
| Skeleton                        | Skeleton                            | Misc. :contentReference[oaicite:87]{index=87}                                                                      |
| ProgressBar                     | ProgressBar                         | Misc. :contentReference[oaicite:88]{index=88}                                                                      |
| ProgressSpinner                 | ProgressSpinner                     | Misc. :contentReference[oaicite:89]{index=89}                                                                      |
| Ripple                          | Ripple                              | Misc. :contentReference[oaicite:90]{index=90}                                                                      |
| StyleClass                      | StyleClass                          | Misc. :contentReference[oaicite:91]{index=91}                                                                      |
| Tag                             | Tag                                 | Misc. :contentReference[oaicite:92]{index=92}                                                                      |
| Terminal                        | Terminal                            | Misc. :contentReference[oaicite:93]{index=93}                                                                      |
| FilterService                   | FilterService                       | Utility/service. :contentReference[oaicite:94]{index=94}                                                           |

---

## B. Official Renames (from v19 Migration Guide)

> These are the **canonical renames** published by PrimeTek. Use the new names in imports/selectors. Old names remained backward-compatible for a period, but you should migrate. :contentReference[oaicite:95]{index=95}

| **Old Name** | **New Name**     |
| ------------ | ---------------- |
| Calendar     | **DatePicker**   |
| Dropdown     | **Select**       |
| InputSwitch  | **ToggleSwitch** |
| OverlayPanel | **Popover**      |
| Sidebar      | **Drawer**       |

---

## C. Deprecated or Removed (with Suggested Replacements)

> Components that were deprecated/removed around v18–v19 and what to use instead. :contentReference[oaicite:96]{index=96}

| **Deprecated / Removed** | **Use Instead**                                   | **Notes**                                                 |
| ------------------------ | ------------------------------------------------- | --------------------------------------------------------- |
| Chips                    | **AutoComplete** (multiple=true, typeahead=false) | Deprecated. :contentReference[oaicite:97]{index=97}       |
| TabMenu                  | **Tabs** (without panels)                         | Deprecated. :contentReference[oaicite:98]{index=98}       |
| Steps                    | **Stepper** (without panels)                      | Deprecated. :contentReference[oaicite:99]{index=99}       |
| InlineMessage            | **Message**                                       | Deprecated. :contentReference[oaicite:100]{index=100}     |
| TabView                  | **Tabs**                                          | Deprecated. :contentReference[oaicite:101]{index=101}     |
| Accordion (legacy API)   | **Accordion** (with new header/content API)       | Modernized API. :contentReference[oaicite:102]{index=102} |
| Messages (wrapper)       | **Message** (loop multiple)                       | Deprecated. :contentReference[oaicite:103]{index=103}     |
| pDefer                   | **Angular’s** built‑in `defer`                    | Deprecated. :contentReference[oaicite:104]{index=104}     |
| TriStateCheckbox         | **Checkbox** (indeterminate)                      | **Removed**. :contentReference[oaicite:105]{index=105}    |
| DataViewLayoutOptions    | **SelectButton**                                  | **Removed**. :contentReference[oaicite:106]{index=106}    |
| pAnimate                 | **AnimateOnScroll**                               | **Removed**. :contentReference[oaicite:107]{index=107}    |

---

## D. Notes

- As of **v20**, PrimeNG follows **semantic versioning**; v18–v19 introduced the major theming and naming revamp. Current versions build iteratively on that without large‑scale renames. :contentReference[oaicite:108]{index=108}
- When migrating old code, the **import path** typically changes with the new name (e.g., `primeng/calendar` → `primeng/datepicker`). :contentReference[oaicite:109]{index=109}

---

# LeaseCalc Extension Documentation

## Project Overview
A Chrome extension providing three property-related calculators:
- Advertising Fee Calculator (SACAT compliant)
- Reletting Fee Calculator (SACAT compliant)  
- Rent Calculator (Move-in costs)

## Core Functionality

### 1. Rent Calculator
```typescript
interface RentCalculation {
  weeklyRent: number;
  twoWeeksAdvance: number;  // weeklyRent * 2
  bond: number;             // weeklyRent <= 800 ? weeklyRent * 4 : weeklyRent * 6 
  totalCost: number;        // twoWeeksAdvance + bond
}
```

### 1.1 Rent Calculator form ui

```typescript
<Card>
      <CardHeader>
        <CardTitle>Rent Calculator</CardTitle>
        <CardDescription>
          Calculate your move-in costs including bond and rent in advance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Weekly Rent Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter weekly rent"
                value={weeklyRent}
                onChange={(e) => dispatch(updateRentCalculator({ weeklyRent: e.target.value }))}
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            {calculatedAdvance !== null && calculatedBond !== null && calculatedTotal !== null && (
              <div className="rounded-md bg-muted p-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Two Weeks Advance:</span> ${calculatedAdvance}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Bond Amount:</span> ${calculatedBond}
                </div>
                <div className="text-sm font-semibold">
                  <span>Total Move-in Cost:</span> ${calculatedTotal}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Calculate Costs
          </Button>
        </form>
      </CardContent>
    </Card>
```

### 2. Advertising Fee Calculator
```typescript
interface AdvertisingCalculation {
  term: number;
  advertisingCost: number;
  weeksRemaining: number;
  calculatedFee: number;    // (advertisingCost * weeksRemaining) / (term * 0.75)
}
```
### 2.1 Advertising Fee Calculator form ui
```typescript

<Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Advertising Fee Calculator</CardTitle>
        <CardDescription>
          Calculate the advertising fee based on SACAT guidelines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            <div>
              <Label>Agreed Term</Label>
              <Select 
                onValueChange={(value) => dispatch(updateAdvertisingFee({ term: parseInt(value) }))}
                defaultValue={term.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term length" />
                </SelectTrigger>
                <SelectContent>
                  {TERM_OPTIONS.map((option) => (
                    <SelectItem key={option.weeks} value={option.weeks.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Advertising Cost ($)</Label>
              <Input
                type="number"
                value={advertisingCost}
                onChange={(e) => dispatch(updateAdvertisingFee({ advertisingCost: e.target.value }))}
                placeholder="Enter advertising cost"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={useDates}
                onCheckedChange={(checked) => dispatch(updateAdvertisingFee({ useDates: checked }))}
              />
              <Label>Use dates instead of weeks</Label>
            </div>

            {useDates ? (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label>Move Out Date</Label>
                  <DateInput
                    value={moveOutDate ? new Date(moveOutDate) : null}
                    onChange={(date, raw) => {
                      if (raw !== undefined) setRawMoveOutDate(raw)
                      dispatch(updateAdvertisingFee({ moveOutDate: date?.toISOString() ?? null }))
                    }}
                    label={""}
                    error={dateError}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>Agreement End Date</Label>
                  <DateInput
                    value={agreementEndDate ? new Date(agreementEndDate) : null}
                    onChange={(date, raw) => {
                      if (raw !== undefined) setRawEndDate(raw)
                      dispatch(updateAdvertisingFee({ agreementEndDate: date?.toISOString() ?? null }))
                    }}
                    label={""}
                    error={dateError}
                  />
                </div>
                {/* Display calculated weeks if both dates are selected */}
                {moveOutDate && agreementEndDate && (
                  <div className="rounded-md bg-muted px-3 py-2">
                    <p className="text-sm">
                      Calculated weeks remaining:{' '}
                      <span className="font-medium">
                        {calculateWeeksRemaining(new Date(moveOutDate), new Date(agreementEndDate)).weeks ?? 0}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Label>Weeks Remaining</Label>
                <Input
                  type="number"
                  value={weeksRemaining}
                  onChange={(e) => dispatch(updateAdvertisingFee({ weeksRemaining: e.target.value }))}
                  placeholder="Enter weeks remaining"
                />
              </div>
            )}

            <Button 
              onClick={handleCalculate}
              className="w-full mt-4"
            >
              Calculate Fee
            </Button>

            {error && (
              <div className="mt-4 p-4 bg-error rounded-lg">
                <p className="text-lg font-semibold">
                  {error}
                </p>
              </div>
            )}

            {calculatedFee !== null && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-lg font-semibold">
                  Calculated Fee: ${calculatedFee.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>

```

### 3. Reletting Fee Calculator
```typescript
interface RelettingCalculation {
  baseWeeklyRent: number;
  weeklyRentWithGST: number;  // baseWeeklyRent * 1.1
  maximumFee: number;         // (weeklyRentWithGST * 2 * weeksRemaining) / (term * 0.75)
}
```

### 3.1 Reletting Fee Calculator form ui
```typescript
<Card>
      <CardHeader>
        <CardTitle>Rent Calculator</CardTitle>
        <CardDescription>
          Calculate your move-in costs including bond and rent in advance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Weekly Rent Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter weekly rent"
                value={weeklyRent}
                onChange={(e) => dispatch(updateRentCalculator({ weeklyRent: e.target.value }))}
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            {calculatedAdvance !== null && calculatedBond !== null && calculatedTotal !== null && (
              <div className="rounded-md bg-muted p-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Two Weeks Advance:</span> ${calculatedAdvance}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Bond Amount:</span> ${calculatedBond}
                </div>
                <div className="text-sm font-semibold">
                  <span>Total Move-in Cost:</span> ${calculatedTotal}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Calculate Costs
          </Button>
        </form>
      </CardContent>
    </Card>
```

## Project Structure
```plaintext
LeaseCalc-extension/
├── manifest.json           # Extension configuration
├── popup/                 # Extension UI
│   ├── index.html
│   └── App.tsx
├── components/           # React components
│   ├── calculators/     # Calculator components
│   └── ui/             # Shared UI components
└── lib/                # Helper functions
```

## UI Components
All calculators share consistent UI using shadcn/ui:
- Card layout
- Form inputs
- Error displays
- Result sections

## Implementation Guidelines

### 1. Extension Setup
```json
{
  "manifest_version": 3,
  "name": "LeaseCalc",
  "version": "1.0",
  "description": "Property fee calculator",
  "action": {
    "default_popup": "popup.html"
  },
  "permissions": ["storage"]
}
```

### 2. Core Functions
Weekly calculation example:
```typescript
export function calculateWeeksRemaining(moveOut: Date, endDate: Date): number {
  const diffDays = differenceInDays(endDate, moveOut)
  return Math.ceil(diffDays / 7)
}
```

### 3. State Management
Redux slice structure:
```typescript
interface CalculatorState {
  rentCalculator: RentCalculatorState;
  advertFee: AdvertisingFeeState;
  relettingFee: RelettingFeeState;
}
```

## UI Examples
See reference files:
- app/calculators/rent-calculator.tsx
- app/calculators/advertising-fee.tsx
- app/calculators/reletting-fee.tsx

## Development Notes
1. Keep UI consistency with web app
2. Maintain error handling patterns
3. Follow validation flows
4. Use shadcn/ui components

## Testing
1. Load extension in developer mode
2. Test calculations
3. Verify error displays
4. Check persistence

Reference: Chrome extension guide:

Hello World extension 

bookmark_border
Learn the basics of Chrome extension development by building your first Hello World extension.

Overview
You will create a "Hello World" example, load the extension locally, locate logs, and explore other recommendations.

Hello World
This extension will display “Hello Extensions” when the user clicks the extension toolbar icon.

Hello extension
Hello Extension popup
Start by creating a new directory to store your extension files. If you prefer, you can download the full source code from GitHub.

Next, create a new file in this directory called manifest.json. This JSON file describes the extension's capabilities and configuration. For example, most manifest files contain an "action" key which declares the image Chrome should use as the extension's action icon and the HTML page to show in a popup when the extension's action icon is clicked.


{
  "name": "Hello Extensions",
  "description": "Base Level Extension",
  "version": "1.0",
  "manifest_version": 3,
  "action": {
    "default_popup": "hello.html",
    "default_icon": "hello_extensions.png"
  }
}
Download the icon to your directory, and be sure to change its name to match what's in the "default_icon" key.

For the popup, create a file named hello.html, and add the following code:


<html>
  <body>
    <h1>Hello Extensions</h1>
  </body>
</html>
The extension now displays a popup when the extension's action icon (toolbar icon) is clicked. You can test it in Chrome by loading it locally. Ensure all files are saved.

Load an unpacked extension
To load an unpacked extension in developer mode:

Go to the Extensions page by entering chrome://extensions in a new tab. (By design chrome:// URLs are not linkable.)
Alternatively, click the Extensions menu puzzle button and select Manage Extensions at the bottom of the menu.
Or, click the Chrome menu, hover over More Tools, then select Extensions.
Enable Developer Mode by clicking the toggle switch next to Developer mode.
Click the Load unpacked button and select the extension directory.
Extensions page
Extensions page (chrome://extensions)
Ta-da! The extension has been successfully installed. If no extension icons were included in the manifest, a generic icon will be created for the extension.

Pin the extension
By default, when you load your extension locally, it will appear in the extensions menu (Puzzle). Pin your extension to the toolbar to quickly access your extension during development.

Pinning the extension
Pinning the extension
Click the extension's action icon (toolbar icon); you should see a popup.

hello world extension
Hello World extension
Reload the extension
Go back to the code and change the name of the extension to "Hello Extensions of the world!" in the manifest.


{
  "manifest_version": 3,
  "name": "Hello Extensions of the world!",
  ...
}
After saving the file, to see this change in the browser you also have to refresh the extension. Go to the Extensions page and click the refresh icon next to the on/off toggle:

Reload an extension

When to reload the extension
The following table shows which components need to be reloaded to see changes:

Extension component	Requires extension reload
The manifest	Yes
Service worker	Yes
Content scripts	Yes (plus the host page)
The popup	No
Options page	No
Other extension HTML pages	No
Find console logs and errors
Console logs
During development, you can debug your code by accessing the browser console logs. In this case, we will locate the logs for the popup. Start by adding a script tag to hello.html.


<html>
  <body>
    <h1>Hello Extensions</h1>
    <script src="popup.js"></script>
  </body>
</html>
Create a popup.js file and add the following code:


console.log("This is a popup!")
To see this message logged in the Console:

Open the popup.
Right-click the popup.
Select Inspect.
Inspecting the popup.
Inspecting a popup.
In the DevTools, navigate to the Console panel.
DevTools Code Panel
Inspecting a popup
Error logs
Now let's break the extension. We can do so by removing the closing quote in popup.js:


console.log("This is a popup!) // ❌ broken code
Go to the Extensions page and open the popup. An Errors button will appear.

Extensions page with error button

Click the Errors button to learn more about the error:

Extension error details

To learn more about debugging the service worker, options page, and content scripts, see Debugging extensions.

Structure an extension project
There are many ways to structure an extension project; however, the only prerequisite is to place the manifest.json file in the extension's root directory as in following example:

The contents of an extension folder: manifest.json, background.js, scripts folder, popup folder, and images folder.

Use TypeScript
If you are developing using a code editor such as VSCode or Atom, you can use the npm package chrome-types to take advantage of auto-completion for the Chrome API. This npm package is updated automatically when the Chromium source code changes.

Key point: Update this npm package frequently to work with the latest Chromium version.
🚀 Ready to start building?
Choose any of the following tutorials to begin your extension learning journey.

Extension	What you will learn
Run scripts on every page	To insert an element on every page automatically.
Inject scripts into the active tab	To run code on the current page after clicking on the extension action.
Manage tabs	To create a popup that manages browser tabs.
Handle events with service workers	How an extension service worker handles events.

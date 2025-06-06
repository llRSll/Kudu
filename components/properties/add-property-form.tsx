"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Property } from "./property-list";
import { Plus, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import geoService from "@/lib/services/geo-service";
import { Country } from "@/app/api/geo/countries/route";
import { State } from "@/app/api/geo/states/[country]/route";
import { defaultFormData, generateCodeName } from "./utils";
import { AddPropertyFormProps, ExtendedPropertyData, Property } from "./types";

export function AddPropertyForm({ onAddProperty }: AddPropertyFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] =
    useState<ExtendedPropertyData>(defaultFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading((prev) => ({ ...prev, countries: true }));
      const data = await geoService.getCountries();
      setCountries(data);
      setLoading((prev) => ({ ...prev, countries: false }));
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country) {
        setStates([]);
        return;
      }

      setLoading((prev) => ({ ...prev, states: true }));
      const data = await geoService.getStates(formData.country);
      setStates(data);
      setLoading((prev) => ({ ...prev, states: false }));
    };

    fetchStates();
  }, [formData.country]);

  // Set default values when form is opened
  useEffect(() => {
    if (open && countries.length > 0) {
      // Set Australia as default if available
      const australia = countries.find((c) => c.code === "AU");
      if (australia) {
        const newFormData = {
          ...formData,
          country: australia.code,
          countryLabel: australia.name,
        };
        setFormData(newFormData);
      }
    }
  }, [open, countries]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        typeof prev[name as keyof ExtendedPropertyData] === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        [name]: value as
          | "active"
          | "prospect"
          | "under-contract"
          | "in-development"
          | "for-sale"
          | "pending-sale"
          | "archived",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Function to generate and set a random code name
  const handleGenerateCodeName = () => {
    const codeName = generateCodeName();
    setFormData((prev) => ({
      ...prev,
      name: codeName,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format location from address fields
    const location = [formData.city, formData.stateLabel]
      .filter(Boolean)
      .join(", ");

    try {
      onAddProperty({
        ...formData,
        location,
        value: formData.currentValuation,
        id: "",
        income: 0,
        expenses: 0,
        occupancy: 0,
        image: "",
      });

      setFormData(defaultFormData);
      setActiveTab("basic");
      setOpen(false);
    } catch (error: any) {
      // Optionally show error toast here
    }
  };

  // In the location section replace the country dropdown with this:
  const countryDropdown = (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="country" className="text-right">
        Country <span className="text-destructive">*</span>
      </Label>
      <div className="col-span-3">
        <Select
          value={formData.country}
          onValueChange={(value) => {
            // When country changes, find the selected country data
            const selectedCountry = countries.find((c) => c.code === value);
            const countryLabel = selectedCountry ? selectedCountry.name : "";

            // Create updated form data with new country
            const newFormData = {
              ...formData,
              country: value,
              countryLabel: countryLabel,
              state: "",
              stateLabel: "",
            };

            // Set default state if available for this country
            const defaultStateCode = geoService.getDefaultState(value);
            if (defaultStateCode) {
              // We'll set the state in the next useEffect when states are loaded
              setFormData(newFormData);
            } else {
              setFormData(newFormData);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // And replace the state dropdown with this:
  const stateDropdown = (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="state" className="text-right">
        State/Province <span className="text-destructive">*</span>
      </Label>
      <div className="col-span-3">
        <Select
          value={formData.state}
          onValueChange={(value) => {
            const selectedState = states.find((s) => s.code === value);
            const stateLabel = selectedState ? selectedState.name : "";

            setFormData((prev) => ({
              ...prev,
              state: value,
              stateLabel: stateLabel,
            }));
          }}
          disabled={states.length === 0 || loading.states}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                loading.states
                  ? "Loading states..."
                  : states.length === 0
                  ? "No states available"
                  : "Select state"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {states.map((state) => (
              <SelectItem key={state.code} value={state.code}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Add this effect to update the state when states are loaded
  useEffect(() => {
    if (states.length > 0 && formData.country && !formData.state) {
      const defaultStateCode = geoService.getDefaultState(formData.country);
      if (defaultStateCode) {
        const defaultState = states.find((s) => s.code === defaultStateCode);
        if (defaultState) {
          setFormData((prev) => ({
            ...prev,
            state: defaultState.code,
            stateLabel: defaultState.name,
          }));
        }
      }
    }
  }, [states, formData.country]);

  const formSections = {
    basic: (
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name <span className="text-destructive">*</span>
          </Label>
          <div className="col-span-3 flex gap-2">
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1"
              required
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleGenerateCodeName}
              title="Generate random code name"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="under-contract">Under Contract</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="in-development">In Development</SelectItem>
              <SelectItem value="for-sale">For Sale</SelectItem>
              <SelectItem value="pending-sale">Pending Sale</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="description" className="text-right pt-2">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="col-span-3 min-h-[100px]"
            placeholder="Brief description of the property"
          />
        </div>
      </div>
    ),

    location: (
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="streetAddress" className="text-right">
            Street Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="unit" className="text-right">
            Unit/Suite
          </Label>
          <Input
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="col-span-3"
            type="number"
          />
        </div>

        {countryDropdown}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="city" className="text-right">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>

        {stateDropdown}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="postalCode" className="text-right">
            Postal Code
          </Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="col-span-3"
            type="number"
          />
        </div>
      </div>
    ),

    details: (
      <div className="space-y-6 py-4">
        {/* Property Size & Structure Section */}
        <div className="space-y-4">
          <div className="flex items-center pb-2 mb-2 border-b">
            <h3 className="text-sm font-medium">Property Size & Structure</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="area" className="text-right">
                  Interior Area (sqft)
                </Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formData.area || ""}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="lotSize" className="text-right">
                  Lot Size (sqft)
                </Label>
                <Input
                  id="lotSize"
                  name="lotSize"
                  type="number"
                  value={formData.lotSize || ""}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="numUnits" className="text-right">
                  Units
                </Label>
                <Input
                  id="numUnits"
                  name="numUnits"
                  type="number"
                  value={formData.numUnits || ""}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="numFloors" className="text-right">
                  Floors/Levels
                </Label>
                <Input
                  id="numFloors"
                  name="numFloors"
                  type="number"
                  value={formData.numFloors || ""}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rooms & Details Section */}
        <div className="space-y-4">
          <div className="flex items-center pb-2 mb-2 border-b">
            <h3 className="text-sm font-medium">Rooms & Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="bedrooms" className="text-right">
                  Bedrooms
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms || ""}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="bathrooms" className="text-right">
                  Bathrooms
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="parking" className="text-right">
                  Parking Spaces
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="parking"
                    name="parking"
                    type="number"
                    value={formData.parking || ""}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="yearBuilt" className="text-right">
                  Year Built
                </Label>
                <Input
                  id="yearBuilt"
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt || ""}
                  onChange={handleChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  placeholder={new Date().getFullYear().toString()}
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="furnished" className="text-right">
                  Furnished
                </Label>
                <div className="flex h-10 items-center">
                  <Checkbox
                    id="furnished"
                    checked={formData.furnished}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("furnished", checked === true)
                    }
                  />
                  <Label htmlFor="furnished" className="ml-2">
                    Yes
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities & Features Section */}
        <div className="space-y-4">
          <div className="flex items-center pb-2 mb-2 border-b">
            <h3 className="text-sm font-medium">Amenities & Features</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="hasPool"
                checked={formData.hasPool}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("hasPool", checked === true)
                }
              />
              <Label htmlFor="hasPool">Swimming Pool</Label>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="hasSecuritySystem"
                checked={formData.hasSecuritySystem}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("hasSecuritySystem", checked === true)
                }
              />
              <Label htmlFor="hasSecuritySystem">Security System</Label>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="hasSolar"
                checked={formData.hasSolar}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("hasSolar", checked === true)
                }
              />
              <Label htmlFor="hasSolar">Solar Panels</Label>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="petsAllowed"
                checked={formData.petsAllowed}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("petsAllowed", checked === true)
                }
              />
              <Label htmlFor="petsAllowed">Pets Allowed</Label>
            </div>
          </div>
        </div>
      </div>
    ),

    financial: (
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="currentValuation" className="text-right">
            Current Value ($) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="currentValuation"
            name="currentValuation"
            type="number"
            value={formData.currentValuation || ""}
            onChange={handleChange}
            className="col-span-3"
            required
            min="0"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="buildPrice" className="text-right">
            Build Price ($)
          </Label>
          <Input
            id="buildPrice"
            name="buildPrice"
            type="number"
            value={formData.buildPrice || ""}
            onChange={handleChange}
            className="col-span-3"
            min="0"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="purchaseDate" className="text-right">
            Purchase Date
          </Label>
          <Input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="landPrice" className="text-right">
            Land Price ($)
          </Label>
          <Input
            id="landPrice"
            name="landPrice"
            type="number"
            value={formData.landPrice || ""}
            onChange={handleChange}
            className="col-span-3"
            min="0"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="hasExistingStructure" className="text-right">
            Has Existing Structure
          </Label>
          <div className="flex h-10 items-center col-span-3">
            <Checkbox
              id="hasExistingStructure"
              checked={formData.hasExistingStructure}
              onCheckedChange={(checked) =>
                handleCheckboxChange("hasExistingStructure", checked === true)
              }
            />
            <Label htmlFor="hasExistingStructure" className="ml-2">
              Yes
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="privateNotes" className="text-right pt-2">
            Private Notes
          </Label>
          <Textarea
            id="privateNotes"
            name="privateNotes"
            value={formData.privateNotes}
            onChange={handleChange}
            className="col-span-3 min-h-[100px]"
            placeholder="Any private notes about the property financials"
          />
        </div>
      </div>
    ),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Enter the details of your new property. Required fields are marked
            with <span className="text-destructive">*</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">{formSections.basic}</TabsContent>
            <TabsContent value="location">{formSections.location}</TabsContent>
            <TabsContent value="details">{formSections.details}</TabsContent>
            <TabsContent value="financial">
              {formSections.financial}
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6 flex items-center justify-between">
            <div className="flex items-center">
              <span
                className={cn(
                  "text-sm",
                  activeTab === "basic" ? "" : "text-muted-foreground"
                )}
              >
                1. Basic
              </span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span
                className={cn(
                  "text-sm",
                  activeTab === "location" ? "" : "text-muted-foreground"
                )}
              >
                2. Location
              </span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span
                className={cn(
                  "text-sm",
                  activeTab === "details" ? "" : "text-muted-foreground"
                )}
              >
                3. Details
              </span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span
                className={cn(
                  "text-sm",
                  activeTab === "financial" ? "" : "text-muted-foreground"
                )}
              >
                4. Financial
              </span>
            </div>
            <div className="flex gap-2">
              {activeTab !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "location", "details", "financial"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                >
                  Back
                </Button>
              )}
              {activeTab !== "financial" ? (
                <Button
                  type="button"
                  onClick={() => {
                    const tabs = ["basic", "location", "details", "financial"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">Save Property</Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

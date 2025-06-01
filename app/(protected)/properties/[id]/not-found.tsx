import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <div className="container flex h-full items-center justify-center py-20">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Building className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Property Not Found</CardTitle>
          <CardDescription>
            We couldn't find the property you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The property may have been deleted or the ID might be incorrect.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/properties">Return to Properties</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

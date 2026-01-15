export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold text-red-600">
          Unauthorized
        </h1>
        <p className="text-sm text-muted-foreground">
          You don’t have permission to access this page.
        </p>
      </div>
    </div>
  );
}

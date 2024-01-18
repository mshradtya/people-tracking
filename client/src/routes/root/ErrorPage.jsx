import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="text-center p-8 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Oops!</h1>
        <p className="text-lg text-gray-800">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="italic text-gray-600 mt-2">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}

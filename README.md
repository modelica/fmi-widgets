# FMI Widgets

This package was created using `create-react-app` and it is used to render 
various types of FMI data.

## How it works

This application is a bit different than most react applications.  It isn't
actually an application but rather a script that is run in conjunction with
the static FMI web site.  The impact of the script is to bring specific elements
of the FMI site "to life" by mounting React components at key points in the DOM
on some pages.

At the moment, the only React component mounted in the DOM is the
`SupportMatrix` component which will be mounted on any `<div>` with the
`id` attribute set to `support`.

## Distribution

When this package is published to NPM, the contents of the `build/` directory
are included.  This makes it very easy to bundle the packages scripts and
CSS in other applications.
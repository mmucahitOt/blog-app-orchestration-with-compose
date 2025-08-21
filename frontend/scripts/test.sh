#!/bin/bash

# Run tests and exit with proper code
npm test -- --run --reporter=verbose

# Exit with the test exit code
exit $? 
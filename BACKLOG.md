# NDIS Incident Report - Backlog

## UI/UX Issues

### 1. Settings Modal Styling
**Priority: Medium**
- Settings modal for light/dark mode toggle looks poor
- Need to improve styling consistency with rest of application
- Apply proper theme colors and spacing

### 2. Final Report Page Styling  
**Priority: Low**
- Final post report page needs visual improvements
- May already have story planned for this
- Review existing story backlog before implementing

## API Integration & Error Handling

### 3. N8N Workflow Testing
**Priority: High**
- Need to test N8N API integration thoroughly
- Implement proper error/success state handling
- Test both mock and live API modes

### 4. Enhanced Error Messaging in Loading Overlays
**Priority: High**
- Show meaningful error messages in modal dialogues when API calls fail
- Examples of expected errors:
  - Incorrect N8N environment variables
  - N8N server down/unreachable
  - Network connectivity issues
- Error messages should:
  - Appear in the loading overlay (same UI pattern)
  - Pause for 2-3 seconds before dismissing
  - Provide clear, user-friendly error descriptions

### 5. Live API Implementation Testing
**Priority: Medium**
- Implement and test live API calls even without working N8N server
- Ensure proper error handling when server is unavailable
- Validate request/response formats match expected N8N schema
- Test environment variable configuration

## Technical Notes

- Currently no N8N server is set up, so live API calls will fail (expected behavior)
- Error handling should gracefully handle server unavailability
- Mock mode should continue working for development/demo purposes
- Consider adding API health check functionality

## Next Steps

1. Fix settings modal styling
2. Enhance error messaging in loading overlays
3. Test live API integration with proper error handling
4. Review final report page requirements
5. Implement N8N server when ready for full integration testing
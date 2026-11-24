import { Injectable } from '@nestjs/common';
import { formatCleanWidget } from './dashboard-formatter.util';
import type { CleanDashboardWidget } from './dashboard.types';

/**
 * @deprecated Legacy resolver retained for backward-compatibility.
 * All formatting is now handled cleanly by dashboard-formatter.util.ts.
 */
@Injectable()
export class DashboardResolverService {
  public resolveWidget(widgetRecord: any): CleanDashboardWidget {
    return formatCleanWidget(widgetRecord);
  }
}

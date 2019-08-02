import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

   public static handlers: { [key: string]: DetachedRouteHandle } = {};

   private static waitDelete: string;

   public static deleteRouteSnapshot(name: string): void {
      if (CustomReuseStrategy.handlers[name]) {
         delete CustomReuseStrategy.handlers[name];
      } else {
         CustomReuseStrategy.waitDelete = name;
      }
   }

   public shouldDetach(route: ActivatedRouteSnapshot): boolean {
      return true;
   }


   public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
      if (CustomReuseStrategy.waitDelete && CustomReuseStrategy.waitDelete === this.getRouteUrl(route)) {
         // 如果待删除是当前路由则不存储快照
         CustomReuseStrategy.waitDelete = null;
         return;
      }
      CustomReuseStrategy.handlers[this.getRouteUrl(route)] = handle;
   }


   public shouldAttach(route: ActivatedRouteSnapshot): boolean {
      return !!CustomReuseStrategy.handlers[this.getRouteUrl(route)];
   }

   /** 从缓存中获取快照，若无则返回nul */
   public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
      if (!route.routeConfig) {
         return null;
      }

      return CustomReuseStrategy.handlers[this.getRouteUrl(route)];
   }


   public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
      return future.routeConfig === curr.routeConfig &&
         JSON.stringify(future.params) === JSON.stringify(curr.params);
   }

   private getRouteUrl(route: ActivatedRouteSnapshot) {
      return route['_routerState'].url.replace(/\//g, '_');
   }
}

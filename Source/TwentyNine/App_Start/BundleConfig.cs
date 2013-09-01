using System.Web;
using System.Web.Optimization;

namespace TwentyNine
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(
                new ScriptBundle("~/scripts/app")
                    .Include(
                        "~/scripts/jquery-{version}.js",
                        "~/scripts/bootstrap.js",
                        "~/scripts/angular.js",
                        "~/scripts/angular-cookies.js",
                        "~/scripts/ui-bootstrap-tpls-{version}.js",
                        "~/scripts/jquery.signalR-{version}.js",
                        "~/scripts/app/models.js",
                        "~/scripts/app/contracts.js",
                        "~/scripts/app/game29.js"));

            bundles.Add(
                new StyleBundle("~/content/app")
                    .Include(
                        "~/content/bootstrap.css",
                        "~/content/app/game29.css"));
        }
    }
}
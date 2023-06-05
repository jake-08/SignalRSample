using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Data;
using SignalRSample.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

// Add SignalR Service 
var connectionAzureSignalR = builder.Configuration.GetSection("SignalR:PrimaryKey").Get<string>();
builder.Services.AddSignalR().AddAzureSignalR(connectionAzureSignalR);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Chat}/{id?}");
app.MapRazorPages();

// Add route to SignalR Hub
app.MapHub<UserHub>("/hubs/userCount");
//app.MapHub<DeathlyHallowsHub>("/hubs/deathlyHallows");
//app.MapHub<HouseGroupHub>("/hubs/houseGroup");
//app.MapHub<NotificationHub>("/hubs/notification");
//app.MapHub<OrderHub>("/hubs/order");
//app.MapHub<BasicChatHub>("/hubs/basicChat");
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
